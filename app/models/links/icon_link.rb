require 'excon'

class IconLink < Link
   belongs_to :info, polymorphic: true

   has_many :descriptions, as: :describable, dependent: :destroy

   accepts_nested_attributes_for :descriptions, reject_if: :all_blank, allow_destroy: true

   # validates :url, format: { with: /\.(?i-mx:jpg|png)\z/ } # TODO
   validates :descriptions, associated: true
   validate :url, :accessible_image

   def description_for language_code
      descriptions.where(language_code: language_code).first ;end
   
   def accessible_image
      response = Excon.get(url && Addressable::URI.encode(url))

      if response.status.eql?(301)
         new_url = response[:headers]["Location"]
         response = Excon.get(Addressable::URI.encode(new_url)) ;end

      if not response.status.eql?(200)
         raise Excon::Error::Socket ;end

   rescue URI::InvalidURIError
      errors.add(:url, invalid: "The url '#{url}' is invalid")

   rescue Excon::Error::Socket, Excon::Error::Timeout
      errors.add(:url, inaccessible: "The url '#{url}' is inaccessible") ;end;end
