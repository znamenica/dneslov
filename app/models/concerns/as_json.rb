module AsJson
   include ActiveSupport::Concern

   JSON_ATTRS = {
      created_at: nil,
      updated_at: nil,
   }

   def self.extended kls
      kls.include(InstanceMethods)
      kls.include(Redisable)
      kls.extend(Redisable::ClassMethods)

      kls.class_eval do
         after_create :deredisize_model
         after_save :reredisize_instance
         after_destroy :deredisize_instance, :deredisize_model
      end
   end

   def jsonize context = {}
      redisize_sql do
         all.as_json(context)
      end
   end

   def find_by_slug slug
      redisize_model(slug, by_key: :slug) do
         self.joins(:slug).where(slugs: {text: slug}).first
      end
   end

   def find_by_pk primary_key_value
      redisize_model(primary_key_value) do
         self.where(self.primary_key => primary_key_value).first
      end
   end

   module InstanceMethods
      def external_attrs options = {}
         if externals = options[:externals]
            externals.keys.map {|k| [k.to_sym, k.to_sym] }.to_h
         else
            {}
         end
      end

      def instance_attrs
         self.attribute_names.map {|a| [a.to_sym, true] }.to_h
      end

      def embed_attrs
         begin
            self.class.const_get("JSON_ATTRS")
         rescue
            {}
         end
      end

      def additional_attrs
         attributes = self.instance_variable_get(:@attributes).send(:attributes)

         if attributes.is_a?(ActiveModel::LazyAttributeHash)
            attributes.send(:additional_types)
         elsif attributes.is_a?(Hash)
            attributes
         else
            raise
         end
      end

      def generate_json propses, externals = {}
         propses.reduce({}) do |r, (name, props)|
            value =
               if props["rule"].is_a?(Proc)
                  props["rule"][self]
               elsif props["rule"].is_a?(String)
                  externals.fetch(props["rule"].to_sym) { |x| externals[props["rule"]] }
               elsif props["real_name"] != name.to_s
                  read_attribute(props["real_name"]).as_json
               elsif props["rule"].instance_variable_get(:@value)
                  props["rule"].instance_variable_get(:@value)
               elsif props["rule"]
                  read_attribute(props["real_name"] || props["rule"])
               end

            r.merge(name => value)
         end
      end

      def prepare_json options = {}
         attr_hash = [
            instance_attrs,
            JSON_ATTRS,
            embed_attrs,
            additional_attrs,
            external_attrs(options),
            options[:map] || {}
         ].reduce { |r, hash| r.merge(hash.map {|k,v| [k.to_sym, v] }.to_h) }
         except = options.fetch(:except, [])
         only = options.fetch(:only, self.attributes.keys.map(&:to_sym) | (options[:map] || {}).keys | embed_attrs.keys | external_attrs(options).keys)

         attr_hash.map do |(name_in, rule_in)|
            name = /^_(?<_name>.*)/ =~ name_in && _name || name_in.to_s

            next nil if except.include?(name.to_sym) || (only & [ name.to_sym, name_in.to_sym ].uniq).blank?

            rule = parse_rule(rule_in)
            #binding.pry
            [name, { "rule" => rule, "real_name" => name_in.to_s }]
         end.compact.to_h
      end

      def parse_rule rule_in
         %w(TrueClass FalseClass NilClass Symbol).all? {|k| !rule_in.is_a?(k.constantize) } && true || rule_in.is_a?(Symbol) && rule_in.to_s || rule_in
      end

      def jsonize options = {}
         attr_props = prepare_json(options)
         redisize_json(attr_props) do
            generate_json(attr_props, options[:externals])
         end
      end

      def dejsonize options = {}
         attr_props = prepare_json(options)
         deredisize_json(attr_props)
      end

      def as_json options = {}
         attr_props = prepare_json(options)
         generate_json(attr_props, options[:externals])
      end
   end
end
