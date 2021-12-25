module Redisable
   include ActiveSupport::Concern

   class << self
      attr_writer :processor

      PROCESSORS = {
         sidekiq: :Sidekiq, # req: Sidekiq::LimitFetch
         resque: :Resque,
         inline: :Inline
      }

      def processor_kind= value
         self.processor = acquire_processor(PROCESSORS[value]) || Inline
      end

      def acquire_processor symbol
         Object.constants.grep(/^#{symbol}$/).first && Redisable.const_get(symbol)
      end

      def processor
         @processor ||=
            PROCESSORS.reduce(nil) do |res, (_, prc)|
               res || acquire_processor(prc)
            end || Inline
      end

      def enqueue method, *args
         processor.enqueue(method, *args)
      end

      def filtered_for attrs, klass
         filtered = attrs.select {|attr| klass.attribute_types.keys.include?(attr) }
      end

      def assign_reverse_key key, host_key
         # binding.pry
         if value = Rails.cache.read(key)
            Rails.cache.write(key, value | [ host_key ], expires_in: 1.day)
            Rails.logger.debug("Updated key #{key.inspect} with value #{host_key.inspect}")
         else
            Rails.cache.write(key, [ host_key ], expires_in: 1.day)
            Rails.logger.debug("Created key #{key.inspect} with value #{host_key.inspect}")
         end
      end

      def drop_key key
         # binding.pry
         if value = Rails.cache.read(key)
            if key.first == "meta"
               size = value.size

               value.each { |rkey| drop_key(rkey) }
            end

            Rails.logger.debug("Removed key #{key.inspect}#{size && " with #{size} subkeys"}")
            Rails.cache.delete(key)
         end
      end

      def rekey key, type = "meta"
         [type.to_s] + key[1..-1]
      end

      def key_name_for model_name, attrs, type = "meta"
         primary_key = model_name.constantize.primary_key
         [type, model_name, primary_key, attrs[primary_key].to_s]
      end

      def parse_sql_key key
         key[-1].split(/\s(join|from)\s/i)[1..-1].map do |part|
            part.strip.split(/[\s\"]/).reject {|x| x.blank? }.first
         end.uniq.map do |table|
            table.singularize.camelize.constantize rescue nil
         end.compact.each do |klass|
            assign_reverse_key(["meta", klass.name], key)
         end
      end

      def parse_instance_attrs model_name, attrs, key
         model = model_name.constantize
         children =
            attrs.map do |x, value|
               (value.is_a?(Array) || value.is_a?(Hash)) && x || nil
            end.compact

         children.each do |many|
            name = /^_(?<_name>.*)/ =~ many && _name || many.to_s

            instance = nil
            if klass = model.reflections[name]&.klass || many.singularize.camelize.constantize rescue nil
               attres_in = attrs[many]
               attres = attres_in.is_a?(Hash) && [attres_in] || attres_in
               attres.each do |attrs|
                  if attrs[klass.primary_key]
                     assign_reverse_key(key_name_for(klass.name, attrs), key)
                  else
                     assign_reverse_key(["meta", klass.name], key)
                  end
                  parse_instance_attrs(klass.name, attrs, key)
               end

               assign_reverse_key(["meta", klass.name], key)
            end
         end
      end

      def as_json_for instance
         instance.attribute_names.map {|x|[x, instance.read_attribute(x)] }.to_h
      end

      ### internal methods for enqueued proceeds
      #
      def redisize_model_metas metakey, model_name, attrs, key
         # binding.pry
         drop_key(metakey)
         drop_key(metakey[0..1])
         parse_instance_attrs(model_name, attrs, key)
         assign_reverse_key(metakey, key)
      end

      # +redisize_sql_metas+ updates all the meta keys for the result value
      #
      def redisize_sql_metas key, attres
         model_name = key[1]
         primary_key = key[2]

         # binding.pry
         attres.map do |attrs|
            metakey = ["meta", model_name, primary_key, attrs[primary_key]]

            parse_instance_attrs(model_name, attrs, key)
            assign_reverse_key(metakey, key)
         end

         parse_sql_key(key)
      end

      def deredisize_instance_metas key
         metakey = rekey(key)

         # binding.pry
         drop_key(metakey)
         Rails.cache.delete(key)
      end

      def reredisize_instance_metas key
         metakey = rekey(key)
         # binding.pry

         drop_key(metakey)
         assign_reverse_key(metakey, key)
      end

      def deredisize_model_metas model_name
         # binding.pry
         drop_key(["meta", model_name])
      end

      def deredisize_json_metas key
         # binding.pry
         drop_key(key)
      end

      def redisize_json_metas key, attrs
         metakey = key_name_for(key[1], attrs)

         # binding.pry
         parse_instance_attrs(key[1], attrs, key)
         assign_reverse_key(metakey, key)
      end
   end

   # self -> model instance
   def redisize_json scheme, &block
      primary_key = self.class.primary_key
      key = ["json", self.model_name.name, primary_key, self[primary_key].to_s, scheme]

      # binding.pry
      Rails.cache.fetch(key, expires_in: 1.week) do
         value = block.call

         Redisable.enqueue(:redisize_json_metas, key, value)

         value
      end
   end

   # self -> model instance
   def deredisize_json scheme, &block
      primary_key = self.class.primary_key
      key = ["json", self.model_name.name, primary_key, self[primary_key], scheme]

      # binding.pry
      Redisable.enqueue(:deredisize_json_metas, key)
   end

   # self -> model instance
   def deredisize_model
      Redisable.enqueue(:deredisize_model_metas, self.model_name.name)
   end

   # self -> model instance
   def reredisize_instance
      attrs = Redisable.as_json_for(self)
      key = Redisable.key_name_for(self.model_name.name, attrs, "instance")

      # binding.pry
      Rails.cache.write(key, self, expires_in: 1000.years)
      Redisable.enqueue(:reredisize_instance_metas, key)
   end

   # self -> model instance
   def deredisize_instance
      attrs = Redisable.as_json_for(self)
      key = Redisable.key_name_for(self.model_name.name, attrs, "instance")

      # binding.pry
      Redisable.enqueue(:deredisize_instance_metas, key)
   end

   module ClassMethods
      # self -> model class
      def redisize_sql &block
         key = ["sql", self.name, self.primary_key, self.all.to_sql]

         # binding.pry
         Rails.cache.fetch(key, expires_in: 1.day) do
            value = block.call

            Redisable.enqueue(:redisize_sql_metas, key, value)

            value
         end
      end

      # self -> model class
      def redisize_model value, options = {}, &block
         primary_key = options.fetch(:by_key, self.primary_key).to_s
         key = ["instance", name, primary_key, value]
         metakey = ["meta", self.model_name.name, primary_key, value]

         # binding.pry
         Rails.cache.fetch(key, expires_in: 1.week) do
            if result = block.call
               Redisable.enqueue(:redisize_model_metas, metakey, self.name, Redisable.as_json_for(result), key)
            end

            result
         end
      end
   end

   class Resque
      @queue = :caching

      class << self
         def enqueue *args
            ::Resque.enqueue(self, *args)
         end

         def lock_workers _method, *_args
            @queue
         end

         def perform method, *args
            Redisable.send(method, *args)
         end
      end
   end

   class Sidekiq
      include ::Sidekiq::Worker
      sidekiq_options queue: 'caching'
      sidekiq_options limits: { caching: 1 }
      sidekiq_options process_limits: { caching: 1 }

      def perform method, *args
         Redisable.send(method, *args)
      end

      class << self
         def enqueue *args
            self.perform_async(*args)
         end
      end
   end

   # add: sucker_punch
   # add ActiveJob::Base
   # add: DelayedJobs
   # add: dynflow

   class Inline
      class << self
         def enqueue method, *args
            Redisable.send(method, *args)
         end
      end
   end
end
