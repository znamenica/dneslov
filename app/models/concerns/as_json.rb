module AsJson
   include ActiveSupport::Concern

   JSON_ATTRS = {
      created_at: nil,
      updated_at: nil,
   }

   def embed_attrs
      begin
         self.class.const_get("JSON_ATTRS")
      rescue
         {}
      end
   end

   def additional_attrs
      self.instance_variable_get(:@attributes).send(:attributes).send(:additional_types)
   end

   def as_json options = {}
      attr_hash = [
         JSON_ATTRS,
         embed_attrs,
         additional_attrs,
         options[:map] || {}
      ].reduce { |r, hash| r.merge(hash.map {|k,v| [k.to_sym, v] }.to_h) }
      #attrs_pre = JSON_ATTRS.merge(self.class.const_get("JSON_ATTRS") rescue {})
      #attr_hash = attrs_pre.merge(self.instance_variable_get(:@attributes).send(:attributes).send(:additional_types))
      #attrs =
      #   if options[:only]
      #      attr_hash.keys & options[:only]
      #   else
      #      attr_hash.keys
      #   end
      except = options.fetch(:except, [])
      only = options.fetch(:only, self.attributes.keys.map(&:to_sym) | (options[:map] || {}).keys | embed_attrs.keys)
      original = super(options.merge(except: except | additional_attrs.keys.map(&:to_sym) | embed_attrs.keys | JSON_ATTRS.keys))

      #binding.pry
      attr_hash.reduce(original) do |r, (key, rule)|
         name = /^_(?<_name>.*)/ =~ key && _name || key.to_s

         #binding.pry
         next r if except.include?(name.to_sym) || (only & [ name.to_sym, key.to_sym ].uniq).blank?

         if _name
            r.merge(_name => read_attribute(key).as_json)
         elsif rule.is_a?(Proc)
            r.merge(name => rule[self])
         else
            r
         end
      end
   end
end
