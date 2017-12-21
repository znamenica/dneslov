module GithubAuth
   include ActiveSupport::Concern

   def github
      authenticator = Auth::Github.new
      user_info = authenticator[ params[:code] ]

      new_params = {
         login: user_info['login'],
         name: user_info['name'],
         avatar_url: user_info['avatar_url'],
         location: user_info['location'],
         info: user_info['bio']}

      session.merge!( new_params.merge(
         jwt: JwToken.encode( user_info[ 'login' ]),
         email: user_info['email'] ))
      logger.debug ("SESSION: #{session.to_hash.inspect}")

      # ... create user if it doesn't exist...
      #User.where(login: login).first_or_create!(
      #   name: name,
      #   avatar_url: avatar_url
      #)
      # ... and redirect to client app.
      redirect_to dashboard_path(new_params)
   rescue IOError => error
      redirect_to dashboard_path(error: error.message) ;end

   private

   def issuer
      ENV['CLIENT_URL'] ;end;end
