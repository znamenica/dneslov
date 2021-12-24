module ApplicationHelper
   POSES = [ ( '0'..'9' ).to_a, ( 'а'..'е' ).to_a, 'ё', ( 'ж'..'я' ).to_a ].flatten.reverse

   def t link, options = {}
      model_name = self.object.model_name.i18n_key
      full_link = [ 'serialization', model_name, link.split('.') ].flatten.reject { |x| x.blank? }.join('.')
      I18n.t(full_link, options)
   end

   def date
      @instance_options[ :date ].to_s ;end

   def color_by_slug slug
      slug = slug&.strip || ""
      coeff = 3.0 / ( POSES.size - 1 )
      colors = slug.split("").map { |c| 12 + coeff * POSES.index( c ) }
      letters = colors.map { |c| c < 10 && (c.to_i + '0'.ord) || (c.to_i - 10 + 'a'.ord) }.pack("c*")
      letters << 'f' * (6 - letters.size)
      a = letters.split("")
      [a[0...a.size/2], a[a.size/2...a.size]].transpose.flatten.join ;end

   def slug
      object.slug.text ;end

   def react_component(name, props = {}, options = {}, &block)
      html_options = options.reverse_merge(data: {
         react_class: name,
         react_props: (props.is_a?(String) ? props : props.to_json)
      })
      content_tag(:div, '', html_options, &block) ;end;end
