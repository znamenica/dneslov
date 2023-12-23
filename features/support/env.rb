# IMPORTANT: This file is generated by cucumber-rails - edit at your own peril.
# It is recommended to regenerate this file in the future when you upgrade to a
# newer version of cucumber-rails. Consider adding your own code to a new file
# instead of editing this one. Cucumber will automatically load all features/**/*.rb
# files.

require 'pry'
require 'rack'
require 'rack/test'
require 'database_cleaner/cucumber'
require 'cucumber/rails'
require 'simplecov'
require "simplecov_json_formatter"
require 'shoulda-matchers/cucumber'
require 'factory_bot'
require 'faker'
require 'ffaker'

FactoryBot.definition_file_paths = %w(features/factories)
FactoryBot.lint

World(FactoryBot::Syntax::Methods)
World(Rack::Test::Methods)

Shoulda::Matchers.configure do |config|
   config.integrate do |with|
      with.test_framework :cucumber
      with.library :active_model
      with.library :active_record
   end
end

RSpec::Matchers.define :respond_to do |m|
   match do |object|
      object.respond_to?(m)
   end
end

RSpec::Matchers.define :match_record_yaml do |yaml|
   match do |record|
      deep_match(record, YAML.load(yaml))
   end
end

RSpec::Matchers.define :match_response_json_yaml do |yaml|
   match do |response|
      hash = JSON.load(response.body)
      to_hash = YAML.load(yaml)
      deep_match(hash, to_hash)
   end
end

RSpec::Matchers.define :have_content_in_text_and_inputs do |text|
   match do |page|
      inputs = page.find_all("input", visible: false)

      inputs.any? { |input| /#{text}/ =~ input.value } ||
         page.text.split("\n").any? { |t| /#{text}/ =~ t }
   end
end

Around do |_scenario, block|
   DatabaseCleaner.cleaning( &block )
end

Before('@json') do
   header 'Accept', 'application/json'
   header 'Content-Type', 'application/json'
end

Before do
   Rails.cache.clear
   DatabaseCleaner.start
   @owd = Dir.pwd
   @workdir = Dir.mktmpdir
   @routes ||= ObjectSpace.each_object(ActionDispatch::Routing::RouteSet).to_a.find { |r| r.routes.count > 0 }
   # for minitest
   self.assertions ||= 0
end

After do
   Dir.chdir(@owd)
   DatabaseCleaner.clean
   FileUtils.remove_entry_secure(@workdir)
   FileUtils.rm_rf(Dir["#{Rails.root}/public/public"])
   FileUtils.rm_rf(Dir["#{Rails.root}/public/uploads"])
end

at_exit do
   DatabaseCleaner.clean
end
# Capybara defaults to CSS3 selectors rather than XPath.
# If you'd prefer to use XPath, just uncomment this line and adjust any
# selectors in your step definitions to use the XPath syntax.
# Capybara.default_selector = :xpath

# By default, any exception happening in your Rails application will bubble up
# to Cucumber so that your scenario will fail. This is a different from how
# your application behaves in the production environment, where an error page will
# be rendered instead.
#
# Sometimes we want to override this default behaviour and allow Rails to rescue
# exceptions and display an error page (just like when the app is running in production).
# Typical scenarios where you want to do this is when you test your error pages.
# There are two ways to allow Rails to rescue exceptions:
#
# 1) Tag your scenario (or feature) with @allow-rescue
#
# 2) Set the value below to true. Beware that doing this globally is not
# recommended as it will mask a lot of errors for you!
#
ActionController::Base.allow_rescue = false


DatabaseCleaner[:redis].strategy = :deletion
DatabaseCleaner[:redis].db = Redis.new(url: "redis://localhost:6379/3")

# Remove/comment out the lines below if your app doesn't have a database.
# For some databases (like MongoDB and CouchDB) you may need to use :truncation instead.
begin
  DatabaseCleaner[:active_record].strategy = :transaction
rescue NameError
  raise "You need to add database_cleaner to your Gemfile (in the :test group) if you wish to use it."
end
# You may also want to configure DatabaseCleaner to use different strategies for certain features and scenarios.
# See the DatabaseCleaner documentation for details. Example:
#
#   Before('@no-txn,@selenium,@culerity,@celerity,@javascript') do
#     # { :except => [:widgets] } may not do what you expect here
#     # as Cucumber::Rails::Database.javascript_strategy overrides
#     # this setting.
#     DatabaseCleaner.strategy = :truncation
#   end
#
#   Before('~@no-txn', '~@selenium', '~@culerity', '~@celerity', '~@javascript') do
#     DatabaseCleaner.strategy = :transaction
#   end
#

# Possible values are :truncation and :transaction
# The :transaction strategy is faster, but might give you threading problems.
# See https://github.com/cucumber/cucumber-rails/blob/master/features/choose_javascript_database_strategy.feature
Cucumber::Rails::Database.javascript_strategy = :truncation

# rediable processor setup
Redisable.processor_kind = :inline

# simplecov
SimpleCov.start 'rails'
SimpleCov.command_name "features" + (ENV['TEST_ENV_NUMBER'] || '')
SimpleCov.formatter = SimpleCov::Formatter::JSONFormatter
