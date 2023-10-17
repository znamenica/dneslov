require 'excon'

class UriValidator < ActiveModel::EachValidator
   def validate_each(record, attribute, value)
      # if a local link just return true
      return true if value =~ %r{^/}

      response = Net::HTTP.get_response(URI(value && Addressable::URI.encode(value)))
      # validates :url, format: { with: /\.(?i-mx:jpg|png)\z/ } # TODO

      if [301, 303, 307].include?(response.code.to_i)
         new_url = response[:headers]["Location"]
         if options[:allow_lost_slash] && value + "/" == new_url
            return true
         end

         if options[:allow_redirect]
            response = Net::HTTP.get_response(URI(Addressable::URI.encode(new_url)))
         end
      end

      unless [200, 302].include?(response.code.to_i)
         raise SocketError
      end
   rescue URI::InvalidURIError, Addressable::URI::InvalidURIError
      record.errors[attribute] << I18n.t('activerecord.errors.invalid_uri', uri: value)
   rescue SocketError, Errno::ECONNREFUSED, OpenSSL::SSL::SSLError, Net::OpenTimeout
      record.errors[attribute] << I18n.t('activerecord.errors.inaccessible_uri', uri: value)
   end
end
