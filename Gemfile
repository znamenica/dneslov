source 'https://rubygems.org'

git_source(:github) do |repo_name|
  repo_name = "#{repo_name}/#{repo_name}" unless repo_name.include?("/")
  "https://github.com/#{repo_name}.git"
end

ruby '2.7.1'

gem 'rails', '~> 5.2.4', '>= 5.2.4.2'
gem 'pg'
#NOTE http://mikecoutermarsh.com/2013/09/22/using-hstore-with-rails-4/
# gem 'postgres_ext'

# Use Uglifier as compressor for JavaScript assets
gem 'uglifier', '>= 2.7.2'
# Use CoffeeScript for .js.coffee assets and views
# gem 'coffee-rails', '~> 4.2.2'

# Use jquery as the JavaScript library
# CVE-2015-1840 - CSRF VULNERABILITY fix
# gem 'jquery-rails', '~> 4.3.1'
# Widelinks makes following links in your web application faster.
# gem 'wiselinks'
# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
# gem 'jbuilder', '~> 2.7'
# bundle exec rake doc:rails generates the API under doc/api.
gem 'sdoc', '~> 1.0.0', group: :doc

# gem 'globalize'
# gem 'globalize-versioning'

gem "figaro"

# Use ActiveModel has_secure_password
# gem 'bcrypt', '~> 3.1.7'
# Use Redis adapter to run Action Cable in production
# gem 'redis', '~> 3.0'

## controllers
gem 'has_scope', '>= 0.7.2'

## models
gem 'validate_url'
gem 'activerecord_json_validator'
gem 'attribute-defaults'
gem 'addressable'

# view
## NPM packaging
gem 'npm-pipeline-rails', '>= 1.8.1'

## pagination
gem 'kaminari', '>= 1.1.1'

## decoration/serialization
gem 'active_model_serializers', '>= 0.10.10'

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

group :development do
   gem 'capistrano', '~> 3.6'
   gem 'capistrano-rails', '~> 1.3'
   gem 'capistrano3-nginx'
   gem 'capistrano-bundler'
   gem 'capistrano-rake'
   gem 'capistrano-rvm'
   gem 'dry_crud' , '>= 5.2.0' # then rails generate dry_crud [--templates haml] [--tests rspec]
   gem 'web-console', '>= 3.7.0'
   gem 'pattern_generator', '>= 0.1.0'
   # deploy
   gem 'ed25519', '~> 1.2'
   gem 'bcrypt_pbkdf', '~> 1.0'
   # gem 'bullet' # gives exception
end

group :development, :test do
   gem 'ruby-prof'
   gem "factory_bot_rails", ">= 5.1.1"
   gem 'pry', '~> 0.10.4'
   gem 'pry-rails', '~> 0.3.6'
   gem 'pry-remote'
   gem 'pry-stack_explorer'
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
   gem 'simplecov', '>= 0.17.1'
   gem 'database_cleaner'
   gem "launchy"
   gem "capybara"
   gem 'capybara-webkit', '>= 1.15.1'
   gem "email_spec"
   gem 'travis', '>= 1.8.10'
end

group :production do
   gem 'puma', '~> 4.3'
end

