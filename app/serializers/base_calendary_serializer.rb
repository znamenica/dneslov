class BaseCalendarySerializer < CommonCalendarySerializer
   attributes :title, :url, :color, :slug, :description

   def title
      object._title ;end

   def description
      object._description ;end

   def url
      object._url ;end

   def slug
      object._slug ;end

   def color
      color_by_slug( slug ) ;end;end
