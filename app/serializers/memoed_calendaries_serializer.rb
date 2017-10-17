class MemoedCalendariesSerializer < ActiveModel::Serializer::CollectionSerializer
   def locales
      @options[:locales] ;end

   def as_json *args
      serializable_hash ;end

   def serializable_hash(adapter_options = {},
                         options = {},
                         adapter_instance = ActiveModel::Serializer.serialization_adapter_instance.new(self))
      include_directive = ActiveModel::Serializer.include_directive_from_options(adapter_options)
      adapter_options[:cached_attributes] ||= ActiveModel::Serializer.cache_read_multi(self, adapter_instance, include_directive)
      adapter_opts = adapter_options.merge(include_directive: include_directive)

      grouped_calendaries do |calendary_s|
         calendary_s.serializable_hash(adapter_opts, options, adapter_instance) ;end;end

   def grouped_calendaries
      object.group_by do |memo|
         #TODO blank calendary. NOTE what is blank?
         memo.calendary
      end.select { |(calendary, _)| calendary }.map do |(calendary, memos)|
         if calendary
            yield( CalendarySerializer.new( calendary, memos: memos, locales: locales )) end;end;end;end