class ServiceLink < Link
   validates :url, uri: { allow_lost_slash: true }

   belongs_to :info, inverse_of: :service_links, polymorphic: true ;end
