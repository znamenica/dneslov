class Auth::Github
   attr_reader :connection

   def initialize connection = Excon
      @connection = connection
   end

   def [] code
      access_token_resp = fetch_github_access_token(code)
      access_token = access_token_resp['access_token']
      fetch_github_user_info(access_token)
   end

   private

   def fetch_github_access_token code
      uri = URI(ENV["GITHUB_ACCESS_TOKEN_URL"])
      query = {
         code:          code,
         client_id:     ENV["GITHUB_CLIENT_ID"],
         client_secret: ENV["GITHUB_CLIENT_SECRET"]
      }
      uri.query = URI.encode_www_form(query)
      res = Net::HTTP.get_response(uri)

      if res.status != 200
         Rails.logger.error "GITHUB OAUTH ERROR: FETCH_ACCESS_TOKEN. Response headers are: #{resp.headers.inspect}"
         raise IOError, 'FETCH_ACCESS_TOKEN'
      end

      URI.decode_www_form(res.body).to_h
   end

   def fetch_github_user_info access_token
      req = Net::HTTP::Get.new(ENV["GITHUB_USER_INFO_URL"])
      req['Authorization'] = "token #{access_token}"
      req['User-Agent'] = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 " +
         "(KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36"

      res = Net::HTTP.start(uri.hostname, uri.port) {|http| http.request(req) }

      if res.status != 200
         Rails.logger.error "GITHUB OAUTH ERROR: FETCH_USER_INFO. Response headers are: #{resp.headers.inspect}"
         raise IOError, 'FETCH_USER_INFO'
      end

      JSON.parse(res.body)
   end
end
