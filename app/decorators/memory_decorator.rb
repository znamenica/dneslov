class MemoryDecorator < Draper::Decorator
   delegate_all

   def date
      "(#{filtered_events.first.happened_at})" ;end

   def councils
      if council.present?
         h.content_tag :div do
            council.split(',').map do |council|
               h.content_tag :span, class: 'chip' do
                  council ;end;end;end;end;end

   def being_line
      if beings.present?
         h.content_tag( :span, 'Бытие: ' ) +
         beings_for( :ру ).map do | link |
            chip_for( link.url ) ;end
         .join.html_safe ;end;end

   def wiki_line
      if wikies.present?
         h.content_tag( :span, 'Вики: ' ) +
         wikies_for( :ру ).map do | link |
            chip_for( link.url ) ;end
         .join.html_safe ;end;end

   def pateric_line
      if paterics.present?
         h.content_tag(:span, 'Отечник: ') +
         paterics_for( :ру ).map do | link |
            chip_for( link.url ) ;end
         .join.html_safe ;end;end

   def icon_feed
      if icon_links.present?
         h.content_tag :div, class: 'carousel' do
            icon_links.map do | link |
               h.content_tag :a, class: 'carousel-item', href: '#' do
                  h.content_tag :img, nil, src: link.url ;end;end
            .join.html_safe ;end;end;end

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

   def memo_line
      if memos.present?
         h.content_tag( :span, 'Помин: ' ) +
         memos.map do | memo |
            next if not memo.calendary

            if link = memo.calendary.links.first
               chip_for( link, memo.calendary.slug.text )
            else
               h.content_tag :span, class: 'chip' do
                  memo.calendary.slug.text ;end;end;end
         .uniq.join.html_safe ;end;end

   def troparion
      if troparion = troparions.select { |t| t.text.present? }.first
         h.content_tag( :span, "Тропарь, глас #{troparion.tone}" ) +
         h.content_tag( :span, troparion.text ) ;end;end

   def kontakion
      if kontakion = kontakions.select { |k| k.text.present? }.first
         h.content_tag( :span, "Кондак, глас #{kontakion.tone}" ) +
         h.content_tag( :span, kontakion.text ) ;end;end

   def chip_for link, text = nil, color = nil
      args = { class: 'chip' }
      args[ :style ] = "background-color: ##{color};" if color

      h.content_tag :span, args do
         if link
            /https?:\/\/(?<domain>[a-zA-Z0-9_-]+)\.\w+\// =~ link
            # binding.pry
            h.content_tag :a, href: link do
               text || domain ;end
         else
            text ;end;end;end;end
