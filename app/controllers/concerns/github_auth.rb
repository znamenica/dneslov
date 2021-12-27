module GithubAuth
   include ActiveSupport::Concern

   def github
      Kernel.puts params.inspect
      Kernel.puts params[:code].inspect
      authenticator = Auth::Github.new
      # params = {}
      user_info = authenticator[params[:code]]

      Kernel.puts user_info.inspect
      session_params = {
         'login': user_info['login'],
         'name': user_info['name'],
         'avatar_url': user_info['avatar_url'],
         'location': user_info['location'],
         'info': user_info['bio'],
         'jwt': JwToken.encode(user_info['login']),
         'email': user_info['email']
      }

      update_session(session_params)
      Kernel.puts session_params.inspect
      logger.debug ("Session from Github: #{session.to_hash.inspect}")

      # ... create user if it doesn't exist...
      #User.where(login: login).first_or_create!(
      #   name: name,
      #   avatar_url: avatar_url
      #)
      # ... and redirect to client app.
      new_params = session.to_hash.select {|x| %w(_csrf_token login name avatar_url location info).include?(x) }

      Kernel.puts new_params.inspect
      redirect_to dashboard_path(new_params)
   rescue Exception => error
      Kernel.puts error.inspect
      Kernel.puts dashboard_path(error: error.message)
      redirect_to dashboard_path(error: error.message)
   end

   private

   def issuer
      ENV["GITHUB_CLIENT_URL"]
   end
end
