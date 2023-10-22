module JwToken
   class << self
      def encode sub
         payload = {
            iss: ENV["GITHUB_CLIENT_URL"],
            sub: sub,
            exp: 6.months.from_now.to_i,
            iat: Time.now.to_i
         }
         JWT.encode payload, ENV["JWT_SECRET"], 'HS256'
      end

      def decode token
         options = {
            iss: ENV["GITHUB_CLIENT_URL"],
            verify_iss: true,
            verify_iat: true,
            leeway: 30,
            algorithm: 'HS256'
         }
         JWT.decode token, ENV["JWT_SECRET"], true, options
      end
   end
end
