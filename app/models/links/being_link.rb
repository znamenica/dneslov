class BeingLink < Link
   include Languageble

   has_alphabeth novalidate: true

   validates :url, uri: { allow_lost_slash: true }

   belongs_to :info, inverse_of: :beings, polymorphic: true
end
