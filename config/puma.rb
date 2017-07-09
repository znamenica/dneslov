workers Integer(ENV['WEB_CONCURRENCY'] || 1)
threads_count = Integer(ENV['MAX_THREADS'] || 5)
threads threads_count, threads_count

preload_app!

rackup      DefaultRackup
port        ENV['PORT']     || 3000
environment ENV['RACK_ENV'] || 'development'

if ENV['RACK_ENV'] == 'production'
   app_dir = File.expand_path("../..", __FILE__)
   shared_dir = "#{app_dir}/shared"
   bind "unix://#{shared_dir}/tmp/sockets/puma.sock"
   stdout_redirect "#{shared_dir}/tmp/log/stdout.log", "#{shared_dir}/tmp/log/stderr.log"
   pidfile "#{shared_dir}/tmp/pids/puma.pid"
   state_path "#{shared_dir}/pids/puma.state"
   activate_control_app
   daemonize true
end

on_worker_boot do
   # Worker specific setup for Rails 4.1+
   # See: https://devcenter.heroku.com/articles/deploying-rails-applications-with-the-puma-web-server#on-worker-boot
   require "active_record"
   ActiveRecord::Base.connection.disconnect! rescue ActiveRecord::ConnectionNotEstablished
   ActiveRecord::Base.establish_connection(YAML.load_file("#{app_dir}/config/database.yml")[rails_env])
end
