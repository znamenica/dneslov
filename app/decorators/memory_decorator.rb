class MemoryDecorator < Draper::Decorator
   delegate_all

   def date
      # TODO if no proper event, just skip, remove then
      year = (filtered_events.first.try(:happened_at) || "").split(".").last
      year && "(#{year.strip})" ;end

   def council_chips
      council.split(',').map do |council|
         /(?<pure_council>[^?]*)\??\z/ =~ council # NOTE crop ? mark
         chip_for( nil, pure_council ) end
      .join.html_safe ;end

   def memo_chips_present?
      memos.any? { | memo | memo.calendary } ;end

   def memo_chips_each
      memos.map do | memo |
         next if not memo.calendary

         slug = memo.calendary.slug.text
         link = memo.calendary.links.first
         date = memo.date

         yield( memo, link, date, slug, color_by_slug( slug ) ) ;end;end

   POSES = [ ( 0..9 ).to_a, ( 'а'..'е' ).to_a, 'ё', ( 'ж'..'я' ).to_a ].flatten

   def color_by_slug slug
      coeff = 10.0 / ( POSES.size - 1 )
      colors = slug.split("").map { |c| 5 + coeff * POSES.index( c ) }
      letters = colors.map { |c| c < 10 && (c.to_i + '0'.ord) || (c.to_i - 10 + 'a'.ord) }.pack("c*")
      letters << '5' * (6 - letters.size)
   end

   def chip_for link, text = nil, color = nil
      args = { class: 'chip' }
      args[ :style ] = "background-color: ##{color};" if color

      h.content_tag :span, args do
         if link
            /https?:\/\/(?<domains>[a-zA-Z0-9_\.-]+)\.[\w]+\// =~ link
            domain = domains.split(".").select { |d| d.size > 2 }.first
            # binding.pry
            h.content_tag :a, href: link, target: :blank do
               text || domain ;end
         else
            text ;end;end;end;end
