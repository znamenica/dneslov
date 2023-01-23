# Add your own tasks in files placed in lib/tasks ending in .rake,
# for example lib/tasks/capistrano.rake, and they will automatically be available to Rake.
ENV['RAILS_ENV'] ||= 'test' if ARGV.include?('cucumber')

require_relative File.expand_path('../config/application', __FILE__)
Rails.application.load_tasks

if Rails.env.test?
   require 'cucumber'
   require 'cucumber/rake/task'

   Cucumber::Rake::Task.new(:cucumber) do |t|
      t.cucumber_opts = "features --format pretty"
   end
end

task :clean do
   puts "Cleaning..."
   `git clean -fd`
   `rm -rf $(find  . -name "*~" -o \\( -type d -name '.bundle' -o -type d -name 'node_modules' \\) -prune |grep ~\\$)`
end

task :default => :cucumber
