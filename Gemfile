ruby '3.1.4'

source 'https://rubygems.org'

git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?("/")
  "https://github.com/#{repo_name}.git"
end

## Bundler
gem 'bundler', '>= 2.3.12'

## Environment
gem 'dotenv-rails', require: 'dotenv/rails-now', github: "majioa/dotenv"

## Core
gem "rails", "~> 7.0.0", ">= 7.0.4.1"
gem 'pg'
##NOTE http://mikecoutermarsh.com/2013/09/22/using-hstore-with-rails-4/
# gem 'postgres_ext'

### Use Uglifier as compressor for JavaScript assets
gem 'uglifier', '>= 2.7.2'

### JS and CSS bunding
gem 'redcarpet'

## Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
# gem 'jbuilder', '~> 2.7'
## bundle exec rake doc:rails generates the API under doc/api.
gem 'sdoc', '~> 1.0.0', group: :doc
gem 'rdoc', '~> 6.3.2', group: :doc

# gem 'globalize'
# gem 'globalize-versioning'

gem "figaro"

## Use ActiveModel has_secure_password
# gem 'bcrypt', '~> 3.1.7'

# caching
## Use Redis adapter to run Action Cable in production
## cache, session, rack / json, with usage delayed_jobs
gem 'hiredis', '~> 0.6'
gem 'redis', '~> 4.0', require: %w(redis redis/connection/hiredis)
gem 'redis-rails', github: 'redis-store/redis-rails'
gem 'redis-rack-cache'
gem 'snappy'
gem 'sidekiq', ">= 6.4.0", require: %w(sidekiq sidekiq/web)
gem 'sidekiq-worker-killer'
gem 'sidekiq-limit_fetch'
# gem "jsonize", ">= 0.1.1", "~> 0.1"
# gem 'jsonize', path: '/usr/local/home/majioa/git/jsonize'
gem "jsonize", github: 'majioa/jsonize', ref: '96c8b77'
# gem "redisize", ">= 0.1.4", "~> 0.1"
# gem 'redisize', path: '/usr/local/home/majioa/git/redisize'
gem 'redisize', github: 'majioa/redisize', ref: 'be60757'

## controllers
gem 'has_scope', '>= 0.7.2'

## models
gem 'validate_url'
gem 'activerecord_json_validator'
gem 'attribute-defaults'
gem 'addressable'
gem 'acts_as_list'

## JSON
gem 'oj'

## pagination
gem 'kaminari', '>= 1.1.1'

## authentication
gem 'jwt'

## authorization
gem 'pundit'

## logging
#gem 'rdoba', path: '/usr/local/home/majioa/git/rdoba'
gem 'rdoba', git: 'https://github.com/3aHyga/rdoba.git'

## orthodox
gem 'when_easter'

## data
gem 'activerecord-import', '~> 1.4.1'
gem 'zero_downtime_migrations', github: 'majioa/zero_downtime_migrations', ref: 'devel'
#gem 'zero_downtime_migrations', path: '/usr/local/home/majioa/git/zero_downtime_migrations'
# gem 'active_record_extended'

## pdf
gem 'prawn', git: 'https://github.com/majioa/prawn.git', ref: '10e29240e'

## deploy start
gem 'foreman'

# Reduces boot times through caching; required in config/boot.rb
gem "bootsnap", require: false

# standard rails assets pipeline
gem 'sassc-rails'
gem 'sprockets-rails'

## api
# gem 'tiun', path: '/usr/local/home/majioa/git/tiun'
gem 'tiun', github: 'majioa/tiun', ref: '2b09248'

# sitemap
gem 'sitemap_generator'

# images
gem 'carrierwave', '~> 3.0.5'
gem 'carrierwave-base64'
gem 'carrierwave-i18n'
gem 'carrierwave_backgrounder'
gem 'carrierwave-processing'
#gem 'fog'
#gem 'fog-'
gem 'rmagick'

group :development do
   gem "capistrano", "~> 3.17", require: false
   gem "capistrano3-nginx", require: false, git: "https://github.com/treenewbee/capistrano3-nginx.git"
   gem 'capistrano-bundler'
   gem "capistrano-rails", "~> 1.6", require: false
   gem 'capistrano-rvm'
   gem 'capistrano-rake'
   gem "capistrano-systemd-multiservice", require: false, git: "https://github.com/majioa/capistrano-systemd-multiservice.git"
   gem "capistrano-db-tasks", require: false, github: "majioa/capistrano-db-tasks", ref: "devel"
   # gem "capistrano-db-tasks", require: false, path: '/usr/local/home/majioa/git/capistrano-db-tasks'
   gem 'dry_crud' , '>= 6.0.0' # then rails generate dry_crud [--templates haml] [--tests rspec]
   gem 'web-console', '~> 4.2'
   gem 'pattern_generator', '>= 0.1.0'
   # deploy
   gem 'ed25519', '~> 1.2'
   gem 'bullet'
   gem 'bcrypt_pbkdf', '~> 1.1'
   gem 'rubocop'
   gem 'rubocop-rails'
   gem "debug"
end

group :development, :test do
   gem 'ruby-prof', github: 'majioa/ruby-prof', ref: 'devel' # raises rack error in 7.0.4 in dashboard when no user session
   gem "factory_bot_rails", ">= 5.1.1"
   gem 'pry', '~> 0.14', '>= 0.14.1'
   gem 'pry-rails', '>= 0.3.9'
   gem 'pry-remote'
   gem 'pry-stack_explorer', '>= 0.6.1'
   gem 'listen', '>= 3.0.5', '< 3.2'
   gem 'spring', '~> 4.0'
   gem 'spring-commands-cucumber'
   gem 'spring-watcher-listen', '~> 2.1'
   gem 'faker'
   gem 'ffaker'
   gem 'bundler-audit'
   gem 'faraday', '~> 1.0'
end

group :test do
   gem 'cucumber-rails', '~> 2.6', require: nil
   gem 'shoulda-matchers', '~> 4.0'
   gem 'shoulda-matchers-cucumber', '~> 1.0'
   gem 'rspec-expectations'
   gem 'simplecov', '~> 0.21'
   gem 'simplecov_json_formatter'
   gem 'database_cleaner-active_record'
   gem 'database_cleaner-redis'
   gem "launchy"
   gem "capybara"
   # gem "selenium-webdriver"
   # gem "webdrivers"
   gem "email_spec"
end

group :production, :staging do
   gem 'puma', '~> 5.6'
   gem 'sentry-rails'
   gem 'sentry-ruby', '~> 5.3', '>= 5.3.1'
   gem 'sentry-sidekiq'
end

group :production, :staging, :development do
   gem "jsbundling-rails"
   gem "cssbundling-rails"
end
