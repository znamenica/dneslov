class MemorySpanSerializer < CommonMemorySerializer
   attributes :icon_url, :url, :names, :default_name_in_calendary

   def year
      calendaries && memo && memo.event.happened_at || super ;end

   def default_name_in_calendary
      calendaries && memo && memo.title_for( locales )&.text ;end

   def titles
      @titles ||= (
         titles = memo.titles_for( locales )

         if locales.include?(:ру)
            titles |= [ Title.new(text: object.short_name) ] ;end

         ActiveModel::Serializer::CollectionSerializer.new(titles,
            serializer: TitleSerializer,
            locales: locales)) ;end

   def names
      MemoryNamesSerializer.new(object.memory_names, locales: locales) ;end

   def icon_url
      #TODO remove `where` when be ready
      object.valid_icon_links.where("url !~ 'azbyka'").first&.url ;end

   def url
      slug_path( slug ) ;end

   def descriptions
      ActiveModel::Serializer::CollectionSerializer.new(memo.descriptions_for( locales ),
         serializer: DescriptionWithCalendarySerializer,
         locales: locales) ;end

   def description
      calendaries && memo && memo.description_for( locales )&.text || super ;end

   protected

   def memo
      @memo ||= calendaries &&
         object.memos.in_calendaries( calendaries ).with_date( date, julian ).first ;end;end
