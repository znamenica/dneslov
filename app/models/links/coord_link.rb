class CoordLink < Link
   validates :url, uri: { allow_lost_slash: true }

   belongs_to :info, inverse_of: :coordinate, polymorphic: true ;end
