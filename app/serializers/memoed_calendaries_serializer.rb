class MemoedCalendariesSerializer < ActiveModel::Serializer::CollectionSerializer
   def locales
      @options[:locales] ;end

   def date
      @options[:date] ;end

   def julian
      @options[:julian] ;end

   def as_json *args
      serializable_hash ;end

   def serializable_hash(adapter_options = {},
                         options = {},
                         adapter_instance = ActiveModel::Serializer.serialization_adapter_instance.new(self))
      include_directive = ActiveModel::Serializer.include_directive_from_options(adapter_options)
      adapter_options[:cached_attributes] ||= ActiveModel::Serializer.cache_read_multi(self, adapter_instance, include_directive)
      adapter_opts = adapter_options.merge(include_directive: include_directive)

      #grouped_calendaries do |calendary_s|
      #   calendary_s.serializable_hash(adapter_opts, options, adapter_instance) ;end;end

      primary_memoes do |memo_s|
         memo_s.serializable_hash(adapter_opts, options, adapter_instance) ;end;end

   def primary_memoes
      object.primary.licit.joins(:event).merge(Event.usual).map do |memo| #TODO remove `merge`
         yield( MemoSpanSerializer.new( memo,
                                        locales: locales,
                                        julian: julian,
                                        date: date )) end;end

   def grouped_calendaries
      object.group_by do |memo|
         #TODO blank calendary. NOTE what is blank?
         memo.calendary
      end.select { |(calendary, _)| calendary&.licit }.map do |(calendary, memos)|
         if calendary
            yield( CalendarySerializer.new( calendary, memos: memos, locales: locales )) end;end;end;end
