# This file is used by Rack-based servers to start the application.

e = "{config.ru}: rails_env: #{rails_env}, ENV[RAILS_ENV]: #{ENV['RAILS_ENV']}"
$stderr.puts e
$stdout.puts e

require ::File.expand_path('../config/environment',  __FILE__)
run Rails.application
