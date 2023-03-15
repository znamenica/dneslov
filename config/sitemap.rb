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

   # Add '/articles'
   #
   #   add articles_path, :priority => 0.7, :changefreq => 'daily'

   Memory.find_each do |memory|
      add(slug_path(memory.slug.text), lastmod: memory.updated_at, expires: Time.now + 2.weeks)
   end
end
