# Add your own tasks in files placed in lib/tasks ending in .rake,
# for example lib/tasks/capistrano.rake, and they will automatically be available to Rake.

#require 'cucumber'
#require 'cucumber/rake/task'

require_relative File.expand_path('../config/application', __FILE__)
Rails.application.load_tasks


task :clean do
   puts "Cleaning..."
   `git clean -fd`
   `rm -rf $(find  . -name "*~" -o \\( -type d -name '.bundle' -o -type d -name 'node_modules' \\) -prune |grep ~\\$)`
end

namespace :db do
   desc 'Load DB Config'
   task :load_config do
      ActiveRecord::Tasks::DatabaseTasks.database_configuration =
         Rails.application.config.database_configuration
   end

   desc 'Load Environment'
   task :environment do
      require_relative 'config/environment.rb'
   end

   desc 'Load Config'
   task :load_config => :environment do
      Rails.application
   end

   desc 'Validate seed'
   task :validate => :load_config do
      app = Rails.application
      app.validate
      if !app.errors.empty?
         app.errors.each do |e|
            STDERR.puts e
         end
      end
   end
end

Cucumber::Rake::Task.new(:cucumber) do |t|
   t.cucumber_opts = "features --format pretty"
end

task 'db:seed' => [:load_config]

load "active_record/railties/databases.rake"

task :all => :cucumber

