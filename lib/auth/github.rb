class Auth::Github
   attr_reader :connection

   def initialize connection = Excon
      @connection = connection ;end

   def [] code
      access_token_resp = fetch_github_access_token( code )
      access_token = access_token_resp[ 'access_token' ]
      fetch_github_user_info( access_token ) ;end

   private

   def fetch_github_access_token code
      resp = connection.get ENV[ 'GITHUB_ACCESS_TOKEN_URL' ], query: {
         code:          code,
         client_id:     ENV[ 'CLIENT_ID' ],
         client_secret: ENV[ 'CLIENT_SECRET' ] }

      if resp.status != 200
         Rails.logger.error "GITHUB OAUTH ERROR: FETCH_ACCESS_TOKEN. Response headers are: #{resp.headers.inspect}"
         raise IOError, 'FETCH_ACCESS_TOKEN' ;end

      URI.decode_www_form(resp.body).to_h ;end

   def fetch_github_user_info access_token
      resp = connection.get ENV['GITHUB_USER_INFO_URL'], query: {
         access_token: access_token }

      if resp.status != 200
         Rails.logger.error "GITHUB OAUTH ERROR: FETCH_USER_INFO. Response headers are: #{resp.headers.inspect}"
         raise IOError, 'FETCH_USER_INFO' ;end

      JSON.parse(resp.body) ;end;end
