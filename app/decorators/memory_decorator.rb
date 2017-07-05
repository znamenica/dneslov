class MemoryDecorator < ApplicationDecorator
   delegate_all

   def date
      # TODO if no proper event, just skip, remove then
      year = (filtered_events.first.try(:happened_at) || "").split(".").last
      year&.strip ;end

   def council_chips
      council.split(',').map do |council|
         /(?<pure_council>[^?]*)\??\z/ =~ council # NOTE crop ? mark
         chip_for( nil, pure_council ) end
      .join.html_safe ;end

   def memo_chips_present?
      memos.includes(:calendary).any? { | memo | memo.calendary } ;end

   def memo_chips_each
      memos.map do | memo |
         next if not memo.calendary

         slug = memo.calendary.slug.text
         link = memo.calendary.links.first
         date = memo.date

         yield( memo, link, date, slug, color_by_slug( slug ) ) ;end;end

   POSES = [ ( '0'..'9' ).to_a, ( 'а'..'е' ).to_a, 'ё', ( 'ж'..'я' ).to_a ].flatten.reverse

   def color_by_slug slug
      coeff = 3.0 / ( POSES.size - 1 )
      colors = slug.split("").map { |c| 12 + coeff * POSES.index( c ) }
      letters = colors.map { |c| c < 10 && (c.to_i + '0'.ord) || (c.to_i - 10 + 'a'.ord) }.pack("c*")
      letters << 'f' * (6 - letters.size)
      a = letters.split("")
      [a[0...a.size/2], a[a.size/2...a.size]].transpose.flatten.join ;end

   def default_icon_url
      self.valid_icon_links.first&.url ;end

   def chip
      chip_for( slug_path( order ), order, color_by_slug( slug.text ) ) ;end


   def chip_for link, text = nil, color = nil
      args = { class: 'chip' }
      args[ :style ] = "background-color: ##{color};" if color

      h.content_tag :span, args do
         if link
            if not text
               /https?:\/\/(?<domains>[a-zA-Z0-9_\.-]+)\.[\w]+\// =~ link
               text = domains.split(".").select { |d| d.size > 2 }.first ;end

            # binding.pry
            h.content_tag :a, href: link, target: :blank do
               text ;end
         else
            text ;end;end;end;end
