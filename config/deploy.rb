# config valid only for current version of Capistrano
lock "3.13.0"

set :user, 'majioa'
set :application, "dneslov"
set :deploy_user, 'www-data'

set :repo_url, "git@github.com:znamenica/dneslov.git"


# Default branch is :master
# ask :branch, `git rev-parse --abbrev-ref HEAD`.chomp

# Default deploy_to directory is /var/www/my_app_name

# Default value for :format is :airbrussh.
# set :format, :airbrussh

# You can configure the Airbrussh format using :format_options.
# These are the defaults.
# set :format_options, command_output: true, log_file: "log/capistrano.log", color: :auto, truncate: :auto

# Default value for :pty is false

# Default value for :linked_files is []
append :linked_files, "config/database.yml", "config/secrets.yml"

# Default value for linked_dirs is []
append :linked_dirs, "log", "tmp/pids", "tmp/cache", "tmp/sockets", "public/system", "node_modules"

set :tests, []

set(:config_files, %w(
   secrets.example.yml
   database.example.yml
))

set(:symlinks, [
   {
      source: "config/webpack/production.js",
      link: "webpack.config.js"
   },
])

set :migration_role, :app

# Default value for default_env is {}
set :default_env, { path: "#{release_path}/node_modules/yarn/bin:#{release_path}/bin:$PATH" }

set :nginx_roles, :web
set :nginx_static_dir, "public"

set :rvm_type, :user                      # Defaults to: :auto
set :rvm_ruby_version, '2.7.0@dneslov --create'    # Defaults to: 'default'
# set :rvm_custom_path, '~/.rvm'          # only needed if not detected
set :rvm_roles, [:app, :web]


namespace :deploy do
   #after 'deploy:symlink:shared', 'deploy:compile_assets_locally'
   after :finishing, 'deploy:cleanup'
   after 'deploy:updating', 'deploy:symlink:custom'
   #before 'deploy:setup_config', 'nginx:remove_default_vhost'
   #after 'deploy:setup_config', 'nginx:reload'
   after 'deploy:publishing', 'nginx:site:add'
   after 'nginx:site:add', 'nginx:site:enable'
   after 'nginx:site:enable', 'nginx:restart'
   after 'nginx:restart', 'deploy:restart'
end
