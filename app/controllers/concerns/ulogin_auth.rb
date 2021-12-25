module UloginAuth
   include ActiveSupport::Concern

   def ulogin
      token = ''
      http_host = ''
      response = Excon.get('http://ulogin.ru/token.php', token: token, host: http_host)

      user = JSON.decode(response, true);
      #              //$user['network'] - соц. сеть, через которую авторизовался пользователь
      #              //$user['identity'] - уникальная строка определяющая конкретного пользователя соц. сети
      #              //$user['first_name'] - имя пользователя
      #              //$user['last_name'] - фамилия пользователя
                
#      authenticator = Auth::Ulogin.new
#      user_info = authenticator[ params[:code] ]
#
#      new_params = {
#         'login': user_info['login'],
#         'name': user_info['name'],
#         'avatar_url': user_info['avatar_url'],
#         'location': user_info['location'],
#         'info': user_info['bio']}
#
#      session.merge!( new_params.merge(
#         'jwt': JwToken.encode( user_info[ 'login' ]),
#         'email': user_info['email'] ))
#      logger.debug ("SESSION: #{session.to_hash.inspect}")

      redirect_to dashboard_path(new_params)
   rescue IOError => error
      redirect_to dashboard_path(error: error.message)
   end

   private

   def http_host
      ENV["GITHUB_HTTP_HOST"]
   end
end
