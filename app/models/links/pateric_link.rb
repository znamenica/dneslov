class PatericLink < Link
   validates :url, uri: { allow_lost_slash: true }

   belongs_to :info, polymorphic: true, inverse_of: :paterics; end
