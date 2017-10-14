class MemorySerializer < ApplicationSerializer
   attributes :short_name, :color, :slug, :description, :icon_url, :year, :order, :url, :councils

   def short_name
      object.short_name ;end

   def color
      self.color_by_slug( slug ) ;end

   def description
      object.description_for( locales )&.text ;end

   def icon_url
      object.valid_icon_links.first&.url ;end

   def year
      # TODO if no proper event, just skip, remove then
      year = ( object.filtered_events.first.try( :happened_at ) ||
               object.events.first.try( :happened_at ) || "" ).split( "." ).last || '-' ;end

   def order
      {
         slug: object.order,
         color: self.color_by_slug( object.order ),
      } ;end

   def councils
      council = object.council || ''
      council.split(',').map do | council |
         /(?<pure_council>[^?]*)\??\z/ =~ council # NOTE crop ? mark
         memory = Memory.by_slug( pure_council ).first

         {
            slug: pure_council,
            color: self.color_by_slug( pure_council ),
            url: memory && slug_path( pure_council ) || nil
         } ;end;end

   def url
      slug_path( slug ) ;end;end
