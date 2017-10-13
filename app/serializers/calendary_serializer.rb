class CalendarySerializer < ApplicationSerializer
   attributes :name, :url, :color, :slug

   def name
      object.name_for( locales )&.text ;end

   def url
      object.links.first&.url ;end

   def color
      color_by_slug( slug ) ;end;end
