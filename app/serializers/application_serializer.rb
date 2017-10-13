class ApplicationSerializer < ActiveModel::Serializer
   include Rails.application.routes.url_helpers

   POSES = [ ( '0'..'9' ).to_a, ( 'а'..'е' ).to_a, 'ё', ( 'ж'..'я' ).to_a ].flatten.reverse

   def locales
      @instance_options[:locales] ;end

   def color_by_slug slug
      coeff = 3.0 / ( POSES.size - 1 )
      colors = slug.split("").map { |c| 12 + coeff * POSES.index( c ) }
      letters = colors.map { |c| c < 10 && (c.to_i + '0'.ord) || (c.to_i - 10 + 'a'.ord) }.pack("c*")
      letters << 'f' * (6 - letters.size)
      a = letters.split("")
      [a[0...a.size/2], a[a.size/2...a.size]].transpose.flatten.join ;end

   def slug
      object.slug.text ;end;end
