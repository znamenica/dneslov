class MemorySpanSerializer < CommonMemorySerializer
   attributes :icon_url, :url, :names

   def names
      MemoryNamesSerializer.new(object.memory_names, locales: locales) ;end

   def icon_url
      object.valid_icon_links.first&.url ;end

   def url
      slug_path( slug ) ;end;end
