require 'excon'

class UriValidator < ActiveModel::EachValidator
   def validate_each(record, attribute, value)
      response = Excon.get(value && Addressable::URI.encode(value))
      # validates :url, format: { with: /\.(?i-mx:jpg|png)\z/ } # TODO

      if response.status.eql?(301)
         new_url = response[:headers]["Location"]
         if options[:allow_lost_slash] && value + "/" == new_url
            return true ;end

         if options[:allow_redirect]
            response = Excon.get(Addressable::URI.encode(new_url)) ;end;end

      if not response.status.eql?(200)
         raise Excon::Error::Socket ;end

   rescue URI::InvalidURIError
      record.errors[ attribute ] <<
         I18n.t( 'activerecord.errors.invalid_uri', uri: value )

   rescue Excon::Error::Socket, Excon::Error::Timeout
      record.errors[ attribute ] <<
         I18n.t( 'activerecord.errors.inaccessible_uri', uri: value ) ;end;end
