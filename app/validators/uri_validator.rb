require 'excon'

class UriValidator < ActiveModel::EachValidator
   def validate_each(record, attribute, value)
      response = Net::HTTP.get_response(URI(value && Addressable::URI.encode(value)))
      # validates :url, format: { with: /\.(?i-mx:jpg|png)\z/ } # TODO

      if response.code.to_i.eql?(301)
         new_url = response[:headers]["Location"]
         if options[:allow_lost_slash] && value + "/" == new_url
            return true
         end

         if options[:allow_redirect]
            response = Net::HTTP.get_response(URI(Addressable::URI.encode(new_url)))
         end
      end

      if not response.code.to_i.eql?(200)
         raise SocketError
      end

   rescue URI::InvalidURIError, Addressable::URI::InvalidURIError
      record.errors[attribute] << I18n.t('activerecord.errors.invalid_uri', uri: value)

   rescue SocketError
      record.errors[attribute] << I18n.t('activerecord.errors.inaccessible_uri', uri: value)

   end
end
