source 'https://rubygems.org'

git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?("/")
  "https://github.com/#{repo_name}.git"
end

ruby '2.7.5'

## Bundler
gem 'bundler', '>= 2.3.12'



## Environment
gem 'dotenv-rails', require: 'dotenv/rails-now', github: "majioa/dotenv"

## Core
gem 'rails', '~> 5.2.4', '>= 5.2.7.1'
gem 'pg'
##NOTE http://mikecoutermarsh.com/2013/09/22/using-hstore-with-rails-4/
# gem 'postgres_ext'

## Use Uglifier as compressor for JavaScript assets
gem 'uglifier', '>= 2.7.2'

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
## Use Redis adapter to run Action Cable in production
## cache, session, rack / json, with usage delayed_jobs
gem 'hiredis', '~> 0.6'
gem 'redis', '~> 4.0', require: %w(redis redis/connection/hiredis)
gem 'redis-rails', '~> 5.0'
gem 'redis-rack-cache'
gem 'redis-namespace'
gem 'snappy'
gem 'sidekiq', ">= 6.4.0", require: %w(sidekiq sidekiq/web)
gem 'sidekiq-worker-killer'
gem 'sidekiq-limit_fetch'

## controllers
gem 'has_scope', '>= 0.7.2'

## models
gem 'validate_url'
gem 'activerecord_json_validator'
gem 'attribute-defaults'
gem 'addressable'

# rendering
## NPM packaging for view render
gem 'npm-pipeline-rails', '>= 1.8.1'
gem 'redcarpet'

## JSON
gem 'oj'

## pagination
gem 'kaminari', '>= 1.1.1'

## authentication
gem 'excon', '~> 0.71.0'
gem 'jwt'

## authorization
gem 'pundit'

## logging
#gem 'rdoba', path: '/usr/local/home/majioa/git/rdoba'
gem 'rdoba', git: 'https://github.com/3aHyga/rdoba.git'

## orthodox
gem 'when_easter'

## data
gem 'activerecord-import'
gem "zero_downtime_migrations"

## pdf
gem 'prawn', git: 'https://github.com/majioa/prawn.git', ref: '10e29240e'

group :development do
   gem 'capistrano', '~> 3.6'
   gem 'capistrano-rails', '~> 1.3'
   gem 'capistrano3-nginx'
   gem 'capistrano-bundler'
   gem 'capistrano-rvm'
   gem 'capistrano-systemd-multiservice', require: false
   gem 'dry_crud' , '>= 5.2.0' # then rails generate dry_crud [--templates haml] [--tests rspec]
   gem 'web-console', '>= 3.7.0'
   gem 'pattern_generator', '>= 0.1.0'
   # deploy
   gem 'ed25519', '~> 1.2'
   gem 'bcrypt_pbkdf', '~> 1.0'
   gem 'bullet'
end

group :development, :test do
   gem 'ruby-prof'
   gem "factory_bot_rails", ">= 5.1.1"
   gem 'pry', '~> 0.14', '>= 0.14.1'
   gem 'pry-rails', '>= 0.3.9'
   gem 'pry-remote'
   gem 'pry-stack_explorer', '>= 0.6.1'
   gem 'listen', '>= 3.0.5', '< 3.2'
   gem 'spring'
   gem 'spring-commands-cucumber'
   gem 'spring-watcher-listen', '~> 2.0.0'
   gem 'faker'
   gem 'ffaker'
   gem 'bundler-audit'
   gem 'faraday', '~> 1.0'
end

group :test do
   gem 'cucumber-rails', '>= 1.8.0', require: nil
   gem 'shoulda-matchers', '~> 4.0'
   gem 'shoulda-matchers-cucumber', '~> 1.0'
   gem 'rspec-expectations'
   gem 'simplecov', '~> 0.21'
   gem 'simplecov_json_formatter'
   gem 'database_cleaner-active_record'
   gem 'database_cleaner-redis'
   gem "launchy"
   gem "capybara"
   # gem 'capybara-webkit', '>= 1.15.1'
   gem "email_spec"
   gem 'travis', '>= 1.8.10'
end

group :production do
   gem 'puma', '~> 4.3', '>= 4.3.12'
   gem 'sentry-ruby', '~> 5.3', '>= 5.3.1'
   gem 'sentry-rails'
   gem 'sentry-sidekiq'
end
