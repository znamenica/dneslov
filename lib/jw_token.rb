module JwToken
   class << self
      def encode sub
         payload = {
            iss: Rails.application.secrets.github[:client_url],
            sub: sub,
            exp: 4.hours.from_now.to_i,
            iat: Time.now.to_i
         }
         JWT.encode payload, Rails.application.secrets.github[:jwt_secret], 'HS256' ;end

      def decode token
         options = {
            iss: Rails.application.secrets.github[:client_url],
            verify_iss: true,
            verify_iat: true,
            leeway: 30,
            algorithm: 'HS256'
         }
         JWT.decode token, Rails.application.secrets.github[:jwt_secret], true, options ;end;end;end
