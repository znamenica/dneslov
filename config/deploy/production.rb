# server-based syntax
# ======================
# Defines a single server with a list of roles and multiple properties.
# You can define all roles on a single server, or split them:

server "176.113.80.84", port: "222", user: "_nginx", roles: %w{app db web}, primary: true

set :pty, false

# nginx
set :nginx_domains, "dneslov.org"
set :nginx_read_timeout, 60
set :app_server_socket, "#{shared_path}/tmp/sockets/puma.sock"

set :nginx_use_ssl, true
set :nginx_ssl_certificate_path, '/etc/nginx/ssl'
set :nginx_ssl_certificate, 'dneslov.org.pem'
set :nginx_ssl_certificate_key_path, '/etc/nginx/ssl'
set :nginx_ssl_certificate_key, 'dneslov.org.key'
set :nginx_sites_available_dir, "/etc/nginx/sites-available.d"
set :nginx_sites_enabled_dir, "/etc/nginx/sites-enabled.d"

### database
set :disallow_pushing, true

# role-based syntax
# ==================

# Defines a role with one or multiple servers. The primary server in each
# group is considered to be the first unless any hosts have the primary
# property set. Specify the username and a domain or IP for the server.
# Don't use `:all`, it's a meta role.

# role :app, %w{deploy@example.com}, my_property: :my_value
# role :web, %w{user1@primary.com user2@additional.com}, other_property: :other_value
# role :db,  %w{deploy@example.com}

# Configuration
# =============
# You can set any configuration variable like in config/deploy.rb
# These variables are then only loaded and set in this stage.
# For available Capistrano configuration variables see the documentation page.
# http://capistranorb.com/documentation/getting-started/configuration/
# Feel free to add new variables to customise your setup.



# Custom SSH Options
# ==================
# You may pass any option but keep in mind that net/ssh understands a
# limited set of options, consult the Net::SSH documentation.
# http://net-ssh.github.io/net-ssh/classes/Net/SSH.html#method-c-start
#
# Global options
# --------------
#  set :ssh_options, {
#    keys: %w(/home/rlisowski/.ssh/id_rsa),
#    forward_agent: false,
#    auth_methods: %w(password)
#  }
#
# The server-based syntax can be used to override options:
# ------------------------------------
# server "example.com",
#   user: "user_name",
#   roles: %w{web app},
#   ssh_options: {
#     user: "user_name", # overrides user setting above
#     keys: %w(/home/user_name/.ssh/id_rsa),
#     forward_agent: false,
#     auth_methods: %w(publickey password)
#     # password: "please use keys"
#   }
set :stage, :production
set :branch, ENV['BRANCH'] || "master"

set :full_app_name, "#{fetch(:application)}_#{fetch(:stage)}"
set :server_name, "www.dneslov.org dneslov.org"
set :deploy_to, "/var/www/dneslov"

set :rails_env, :production
set :enable_ssl, true
