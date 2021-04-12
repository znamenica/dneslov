class WikiLink < Link
   validates :url, uri: { allow_lost_slash: true }

   belongs_to :info, inverse_of: :wikies, polymorphic: true ;end
