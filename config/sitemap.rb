# Set the host name for URL creation
SitemapGenerator::Sitemap.default_host = "https://dneslov.org"

engines = {
   yandex: 'http://webmaster.yandex.com/site/map.xml?host=%s'
}

SitemapGenerator::Sitemap.search_engines =
   SitemapGenerator::Utilities.reverse_merge(SitemapGenerator::Sitemap.search_engines, engines)

# The directory to write sitemaps to locally
if Rails.env.production? or Rails.env.staging?
   SitemapGenerator::Sitemap.public_path = 'public/'
else
   SitemapGenerator::Sitemap.verbose = true
   SitemapGenerator::Sitemap.public_path = 'tmp/'
end

# Set this to a directory/path if you don't want to upload to the root of your `sitemaps_host`
#SitemapGenerator::Sitemap.sitemaps_path = 'sitemaps/'
SitemapGenerator::Sitemap.create do
   add('/', priority: 1, changefreq: 'daily')
   add('/about', priority: 1, changefreq: 'monthly')

   Memory.find_each do |memory|
      add(slug_path(memory.slug.text), lastmod: memory.updated_at, changefreq: 'daily')
      add(gallery_path(memory.slug.text), lastmod: memory.updated_at, changefreq: 'monthly')

      #memory.pictures.each do |picture|
      #   add(picture_path(memory.slug.text, picture), lastmod: memory.updated_at, changefreq: 'monthly')
      #end

      memory.events.each do |event|
         add(slug_event_path(memory.slug.text, event), lastmod: memory.updated_at, changefreq: 'monthly')
         add(event_gallery_path(memory.slug.text, event), lastmod: memory.updated_at, changefreq: 'monthly')

         event.calendaries.each do |calendary|
            add(cslug_event_path(calendary.slug.text, memory.slug.text, event), lastmod: memory.updated_at, changefreq: 'monthly')
         end
      end

      memory.calendaries.each do |cal|
         add(slug_path(cal.slug.text), priority: 0.7, changefreq: 'daily')
         add(cslug_path(cal.slug.text, memory.slug.text), lastmod: memory.updated_at, changefreq: 'monthly')
      end
   end
end
