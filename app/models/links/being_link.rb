class BeingLink < Link
   validates :url, uri: { allow_lost_slash: true }

   belongs_to :info, inverse_of: :beings, polymorphic: true ;end
