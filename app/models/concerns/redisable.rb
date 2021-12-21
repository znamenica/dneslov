module Redisable
   include ActiveSupport::Concern

   class << self
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
         if meta = Rails.cache.read(key)
            size = meta.size

            meta.each do |rkey|
               if Rails.cache.delete(rkey)
                  Rails.logger.debug("Removed key #{rkey.inspect}")
               end
            end

            Rails.cache.delete(key)
            Rails.logger.debug("Removed key #{key.inspect} with #{size} children")
         end
      end

      def key_name_for instance, type = :meta
         primary_key = instance.class.primary_key
         [type, instance.class.name, primary_key, instance[primary_key]]
      end

      def parse_instance_attrs instance, key, attrs_in = nil
         attrs = attrs_in || instance.attribute_names.map {|x|[x, instance.read_attribute(x)] }.to_h

         children =
            attrs.map do |x, value|
               (value.is_a?(Array) || value.is_a?(Hash)) && x || nil
            end.compact

         # binding.pry
         children.each do |many|
            name = /^_(?<_name>.*)/ =~ many && _name || many.to_s

            if klass = instance._reflections[name]&.klass || many.singularize.camelize.constantize rescue nil
               attres_in = attrs[many]
               attres = attres_in.is_a?(Hash) && [attres_in] || attres_in
               attres.each do |attrs|
                  if !attrs["type"] || klass.name == attrs["type"]
                     newattrs = attrs.merge("describable_id" => instance.id, "describable_type" => instance.class.to_s)
                     i = klass.new(Redisable.filtered_for(newattrs, klass))
                     # binding.pry
                     if i[klass.primary_key]
                        assign_reverse_key(key_name_for(i), key)
                     else
                        assign_reverse_key([:meta, klass.name], key)
                     end
                     parse_instance_attrs(i, key, attrs)
                  end
               end
            end
         end
      end
   end

   # self -> model instance
   def redisize_json scheme, &block
      key = [:json, self, scheme]

      # binding.pry
      Rails.cache.fetch(key, expires_in: 1.week) do
         value = block.call

         metakey = [:meta, self.model_name.name, self.class.primary_key, self.send(self.class.primary_key)]

         Redisable.parse_instance_attrs(self, key, value)
         Redisable.assign_reverse_key(Redisable.key_name_for(self), key)

         #binding.pry
         value
      end
   end

   # self -> model instance
   def deredisize_json scheme, &block
      #binding.pry
      Redisable.drop_key([:json, self, scheme])
   end

   # self -> model instance
   def deredisize_model
      #binding.pry
      Redisable.drop_key([:meta, self.class.name])
   end

   # self -> model instance
   def reredisize_instance
      key = Redisable.key_name_for(self, :instance)
      meta_key = Redisable.key_name_for(self)
      #binding.pry

      Redisable.drop_key(meta_key)
      Rails.cache.write(key, self, expires_in: 1000.years)
      Redisable.assign_reverse_key(meta_key, key)
   end

   # self -> model instance
   def deredisize_instance
      Redisable.drop_key(Redisable.key_name_for(self))
      Rails.cache.delete(Redisable.key_name_for(self, :instance))
   end

   module ClassMethods
      # self -> model class
      def redisize_sql &block
         key = [:sql, self.name, self.all.to_sql]

         # binding.pry
         Rails.cache.fetch(key, expires_in: 1.day) do
            value = block.call

            # update all the meta keys for the reasul value
            value.map do |attrs|
               metakey = [:meta, self.name, self.primary_key, attrs[self.primary_key]]

               instance = self.new(Redisable.filtered_for(attrs, self))
               Redisable.parse_instance_attrs(instance, key, attrs)
               Redisable.assign_reverse_key(metakey, key)
            end
            Redisable.assign_reverse_key([:meta, self.name], key)

            # binding.pry
            value
         end
      end

      # self -> model class
      def redisize_model value, options = {}, &block
         primary_key = options.fetch(:by_key, self.primary_key).to_s
         key = [:instance, name, primary_key, value]

         # binding.pry
         Rails.cache.fetch(key, expires_in: 1.week) do
            result = block.call

            if result
               Redisable.drop_key([:meta, self.model_name.name, primary_key, value])

               Redisable.parse_instance_attrs(result, key)
               Redisable.assign_reverse_key(Redisable.key_name_for(result), key)
            end

            #binding.pry
            result
         end
      end
   end
end
