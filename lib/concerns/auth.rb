module Auth
   include ActiveSupport::Concern

   def current_user
      @current_user || (
         # token = params[:token] || request.env['HTTP_JWT']
         # payload = JwToken.decode(token)
         # @current_user ||= payload[0]['sub'] ) ;end
         @current_user ||= JwToken.decode( session['jwt'] )[0]['sub'])
   rescue => e
      logger.error("JWT Decode error: #{e}")
      nil
   end

   def logged_in?
      !current_user.nil?
   end

   def session_lost?
      session[:login] && !logged_in?
   end

   def drop_session
      session.merge!(
         'login' => nil,
         'name' => nil,
         'avatar_url' => nil,
         'location' => nil,
         'info' => nil,
         'jwt' => nil,
         'email' => nil)
   end

   def authenticate_user!
      head :unauthorized unless logged_in?
   end
end
