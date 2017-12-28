class MemorySpanSerializer < CommonMemorySerializer
   attributes :icon_url, :url, :names, :default_calendary_name

   def default_calendary_name
      if calendaries
         memo = object.memos.in_calendaries(calendaries).first
         memo && memo.description_for( locales )&.text ;end;end

   def names
      MemoryNamesSerializer.new(object.memory_names, locales: locales) ;end

   def icon_url
      object.valid_icon_links.first&.url ;end

   def url
      slug_path( slug ) ;end;end
