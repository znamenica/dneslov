source 'https://rubygems.org'

git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?("/")
  "https://github.com/#{repo_name}.git"
end

ruby '2.3.4'

gem 'rails', '~> 5.1.1'
# Explicitly defined to fix CVE-2015-3225 - POTENTIAL DENIAL OF SERVICE VULNERABILITY
gem 'rack', '~> 2.0'
gem 'pg'
#NOTE http://mikecoutermarsh.com/2013/09/22/using-hstore-with-rails-4/
# gem 'postgres_ext'

# Use Uglifier as compressor for JavaScript assets
gem 'uglifier', '>= 2.7.2'
# Use CoffeeScript for .js.coffee assets and views
gem 'coffee-rails', '~> 4.2.2'

# Use jquery as the JavaScript library
# CVE-2015-1840 - CSRF VULNERABILITY fix
gem 'jquery-rails', '~> 4.3.1'
# Widelinks makes following links in your web application faster.
# gem 'wiselinks'
# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem 'jbuilder', '~> 2.7'
# bundle exec rake doc:rails generates the API under doc/api.
gem 'sdoc', '~> 0.4.0',          group: :doc

# gem 'globalize'
# gem 'globalize-versioning'

gem "figaro"

# Slim html renderer
gem 'slim-rails', '~> 3.1.2'

# css
gem 'materialize-sass'

# Use ActiveModel has_secure_password
# gem 'bcrypt', '~> 3.1.7'
# Use Redis adapter to run Action Cable in production
# gem 'redis', '~> 3.0'

# Use Simple Forms for forms
gem "simple_form"
# Use Sass for Rails for CSS
gem "sass-rails"
gem "bootstrap-sass"
# Explicitly defined: to fix OSVDB-119878 - SESSION FIXATION VULNERABILITY VIA SET-COOKIE HEADERS
gem 'rest-client', '~> 1.8.0'

# Explicitly defined to fix CVE-2015-7499 - HEAP-BASED BUFFER OVERFLOW VULNERABILITY IN LIBXML2 and other in LIBXML2
# and CVE-2015-8806 - Denial of service or RCE from libxml2 and libxslt
gem 'nokogiri', '~> 1.6.8'

# Explicitly defined to fix CVE-2015-7579 - XSS VULNERABILITY IN STRIP_TAGS
# CVE-2015-7578 - POSSIBLE XSS VULNERABILITY
gem 'rails-html-sanitizer', '~> 1.0.3'

# models
#gem 'bukovina', github: 'znamenica/bukovina'
gem 'bukovina', path: '/home/majioa/git/bukovina'
gem 'has_scope'

# view
## NPM packaging
gem 'webpacker'

## pagination
gem 'kaminari'

## decoration
gem 'draper'

group :development do
   gem 'capistrano-rails'
   gem 'dry_crud' # then rails generate dry_crud [--templates haml] [--tests rspec]
   gem 'pattern_generator'
   gem 'web-console', '>= 3.3.0'
end

group :development, :test do
   gem 'ruby-prof'
   gem "factory_girl_rails"
   gem 'pry-rails'
   gem 'pry_debug'
   gem 'listen', '>= 3.0.5', '< 3.2'
   gem 'spring'
   gem 'spring-commands-cucumber'
   gem 'spring-watcher-listen', '~> 2.0.0'
end

group :test do
   gem 'cucumber-rails', require: nil
   gem 'shoulda-matchers', '3.0'
   gem 'rspec-expectations'
   gem 'rspec-wait'
   gem 'simplecov'
   gem 'database_cleaner'
   gem "launchy"
   gem "capybara"
   gem 'capybara-webkit'
   gem "email_spec"
end

group :production do
   gem 'puma', '~> 3.7'
end

