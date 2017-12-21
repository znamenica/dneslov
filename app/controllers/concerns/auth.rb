module Concerns
module Auth
   include ActiveSupport::Concern

   def current_user
      @current_user || (
         # token = params[:token] || request.env['HTTP_JWT']
         # payload = JwToken.decode(token)
         # @current_user ||= payload[0]['sub'] ) ;end
         @current_user ||= JwToken.decode( session['jwt'] )[0]['sub'])
   rescue => e
      logger.error("JWT Decode error: #{e}") ;end

   def logged_in?
      !current_user.nil? ;end

   def authenticate_user!
      head :unauthorized unless logged_in? ;end;end;end
