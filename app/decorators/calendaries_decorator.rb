class CalendariesDecorator < Draper::CollectionDecorator
   def input_value
      object.map { |c| c.slug.text }.join( "," ) ;end;end
