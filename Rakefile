# Add your own tasks in files placed in lib/tasks ending in .rake,
# for example lib/tasks/capistrano.rake, and they will automatically be available to Rake.

require File.expand_path('../config/application', __FILE__)

Rails.application.load_tasks

task :clean do
   puts "Cleaning..."
   `git clean -fd`
   `rm -rf $(find  . -name "*~" -o \\( -type d -name '.bundle' -o -type d -name 'node_modules' \\) -prune |grep ~\\$)` ;end


task :all => :cucumber
