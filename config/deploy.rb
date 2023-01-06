# config valid only for current version of Capistrano
lock "3.17.1"

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
append :linked_files, "config/database.yml", "config/secrets.yml", ".env"

# Default value for linked_dirs is []
append :linked_dirs, "log", "tmp/pids", "tmp/cache", "tmp/sockets", "public/system", "node_modules", "public/images"

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
set :nginx_template, "#{stage_config_path}/#{fetch :stage}/nginx.conf.erb"

set :rvm_type, :user                      # Defaults to: :auto
set :rvm_ruby_version, '2.7.5@dneslov --create'    # Defaults to: 'default'
# set :rvm_custom_path, '~/.rvm'          # only needed if not detected
set :rvm_roles, [:app, :web]

set :systemd_redis_service, "redis"


### database

# if you want to remove the local dump file after loading
set :db_local_clean, true

# if you want to remove the dump file from the server after downloading
set :db_remote_clean, true

# if you want to exclude table from dump
set :db_ignore_tables, []

# if you want to exclude table data (but not table schema) from dump
set :db_ignore_data_tables, []

# configure location where the dump file should be created
set :db_dump_dir, "./db"

# If you want to import assets, you can change default asset dir (default = system)
# This directory must be in your shared directory on the server
set :assets_dir, %w(public/assets public/att)
set :local_assets_dir, %w(public/assets public/att)

# if you want to work on a specific local environment (default = ENV['RAILS_ENV'] || 'development')
set :locals_rails_env, ENV['RAILS_ENV'] || "production"

# if you are highly paranoid and want to prevent any push operation to the server
set :disallow_pushing, true

# if you prefer bzip2/unbzip2 instead of gzip
set :compressor, :bzip2

### tasks


task :setup do
end

# deploy
after 'deploy:publishing', 'systemd:sidekiq:setup'
after 'deploy:publishing', 'systemd:core:setup'
after 'deploy:publishing', 'systemd:sidekiq:enable'
after 'deploy:publishing', 'systemd:core:enable'
after 'deploy:finishing', 'deploy:cleanup'

# deploy:restart
before 'nginx:reload', 'nginx:create_log_paths'
before 'nginx:site:enable', 'nginx:site:add'
before 'nginx:restart', 'nginx:site:enable'
before 'deploy:restart', 'nginx:restart'
after 'deploy:restart', 'systemd:sidekiq:reload-or-restart'
after 'deploy:restart', 'systemd:core:reload-or-restart'

