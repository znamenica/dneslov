class CommonMemorySerializer < ApplicationSerializer
   attributes :short_name, :slug, :description, :year, :order, :councils

   def slug
      object.slug.text ;end

   def short_name
      object.short_name ;end

   def description
      object.description_for( locales )&.text ;end

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
         } ;end;end;end
