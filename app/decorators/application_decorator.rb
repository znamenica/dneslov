class ApplicationDecorator < Draper::Decorator
   POSES = [ ( '0'..'9' ).to_a, ( 'а'..'е' ).to_a, 'ё', ( 'ж'..'я' ).to_a ].flatten.reverse

   # Define methods for all decorated objects.
   # Helpers are accessed through `helpers` (aka `h`). For example:
   #
   #   def percent_amount
   #     h.number_to_percentage object.amount, precision: 2
   #   end
   #
   include Rails.application.routes.url_helpers

   def color_by_slug slug
      coeff = 3.0 / ( POSES.size - 1 )
      colors = slug.split("").map { |c| 12 + coeff * POSES.index( c ) }
      letters = colors.map { |c| c < 10 && (c.to_i + '0'.ord) || (c.to_i - 10 + 'a'.ord) }.pack("c*")
      letters << 'f' * (6 - letters.size)
      a = letters.split("")
      [a[0...a.size/2], a[a.size/2...a.size]].transpose.flatten.join ;end

   def chip_button_if kls
      kls && h.content_tag( :i, kls, class: "material-icons close" ).html_safe || '' ;end

   def slugged_chip link, text = nil, color = nil, kls = nil
      args = { class: 'chip' }
      args[ :style ] = "background-color: ##{color};" if color

      h.content_tag :span, args do
         if link
            if not text
               /https?:\/\/(?<domains>[a-zA-Z0-9_\.-]+)\.[\w]+\// =~ link
               text = domains.split(".").sort_by { |d| d.size }.last ;end

            # binding.pry
            h.content_tag( :a, href: link, target: :blank ) { text } + chip_button_if( kls )
         else
            text ;end;end;end;end
