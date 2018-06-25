class CommonMemorySerializer < ApplicationSerializer
   attributes :titles, :short_name, :slug, :descriptions, :year, :order, :councils

   def slug
      object.slug.text ;end

   def titles
      @titles ||= (
         titles = object.all_titles_for( locales )

         if locales.include?(:ру)
            titles |= [ Title.new(text: object.short_name) ] ;end

         ActiveModel::Serializer::CollectionSerializer.new(titles,
            serializer: TitleSerializer,
            locales: locales)) ;end

   def short_name
      self.titles.first.text ;end

   def descriptions
      ActiveModel::Serializer::CollectionSerializer.new(object.all_descriptions_for( locales ),
         serializer: DescriptionWithCalendarySerializer,
         locales: locales) ;end

   def year
      # TODO if no proper event, just skip, remove then
      year = ( object.filtered_events.first.try( :happened_at ) ||
               object.events.first.try( :happened_at ) || "" ).split( "." ).last || '-' ;end

   def order
      {
         slug: object.order_for( locales ).text,
         color: self.color_by_slug( object.order ) } ;end

   def councils
      council = object.council || ''
      council.split(',').map do | council |
         /(?<pure_council>[^?]*)\??\z/ =~ council # NOTE crop ? mark
         memory = Memory.by_slug( pure_council )

         {
            slug: pure_council,
            color: self.color_by_slug( pure_council ),
            url: memory && slug_path( pure_council ) || nil
         } ;end;end;end
