class MemorySpanSerializer < CommonMemorySerializer
   attributes :icon_url, :url, :names, :default_calendary_name

   def year
      calendaries && memo && memo.event.happened_at || super ;end

   def default_calendary_name
      calendaries && memo && memo.title_for( locales )&.text ;end

   def names
      MemoryNamesSerializer.new(object.memory_names, locales: locales) ;end

   def icon_url
      #TODO remove `where` when be ready
      object.valid_icon_links.where("url !~ 'azbyka'").first&.url ;end

   def url
      slug_path( slug ) ;end

   def description
      calendaries && memo && memo.description_for( locales )&.text || super ;end

   protected

   def memo
      @memo ||= calendaries &&
         object.memos.in_calendaries( calendaries ).with_date( date, julian ).first ;end;end
