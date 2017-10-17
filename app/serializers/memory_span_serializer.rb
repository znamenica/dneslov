class MemorySpanSerializer < CommonMemorySerializer
   attributes :icon_url, :url

   def icon_url
      object.valid_icon_links.first&.url ;end

   def url
      slug_path( slug ) ;end;end
