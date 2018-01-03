class ApplicationSerializer < ActiveModel::Serializer
   include Rails.application.routes.url_helpers

   POSES = [ ( '0'..'9' ).to_a, ( 'а'..'е' ).to_a, 'ё', ( 'ж'..'я' ).to_a ].flatten.reverse

   def t link, options = {}
      model_name = self.object.model_name.i18n_key
      full_link = [ 'serialization', model_name, link.split('.') ].flatten.reject { |x| x.blank? }.join('.')
      I18n.t(full_link, options)
   end

   def julian
      @instance_options[:julian] ;end

   def date
      @instance_options[:date].to_s ;end

   def locales
      @instance_options[:locales] ;end

   def calendaries
      @instance_options[:calendaries] ;end

   def color_by_slug slug
      slug = slug.strip
      coeff = 3.0 / ( POSES.size - 1 )
      colors = slug.split("").map { |c| 12 + coeff * POSES.index( c ) }
      letters = colors.map { |c| c < 10 && (c.to_i + '0'.ord) || (c.to_i - 10 + 'a'.ord) }.pack("c*")
      letters << 'f' * (6 - letters.size)
      a = letters.split("")
      [a[0...a.size/2], a[a.size/2...a.size]].transpose.flatten.join ;end

   def slug
      object.slug.text ;end;end
