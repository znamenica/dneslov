class MemoryDecorator < Draper::Decorator
   delegate_all

   def date
      "(#{filtered_events.first.happened_at})" ;end

   def councils
      h.content_tag :div do
         council.split(',').map do |council|
            h.content_tag :span, class: 'badge' do
               council ;end;end;end;end

   def description
      if description = description_for( :ру )
         h.content_tag( :span, 'Описание: ' ) +
         h.content_tag( :span, description.text ) ;end;end

   def being_line
      if beings.present?
         h.content_tag( :span, 'Бытие: ' ) +
         beings_for( :ру ).map do | link |
            badge_link_for( link.url ) ;end
         .join.html_safe ;end;end

   def wiki_line
      if wikies.present?
         h.content_tag( :span, 'Вики: ' ) +
         wikies_for( :ру ).map do | link |
            badge_link_for( link.url ) ;end
         .join.html_safe ;end;end

   def pateric_line
      if paterics.present?
         h.content_tag(:span, 'Отечник: ') +
         paterics_for( :ру ).map do | link |
            badge_link_for( link.url ) ;end
         .join.html_safe ;end;end

   def icon_feed
      if icon_links.present?
         h.content_tag :div, class: 'carousel' do
            icon_links_for( :ру ).map do | link |
               h.content_tag :a, class: 'carousel-item', href: '#' do
                  h.content_tag :img, src: link ;end;end;end;end;end

   def memo_line
      if memos.present?
         h.content_tag( :span, 'Помин: ' ) +
         memos.map do | memo |
            next if not memo.calendary

            if link = memo.calendary.links.first
               badge_link_for( link, memo.calendary.slug.text )
            else
               h.content_tag :span, class: 'badge' do
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

   protected

   def badge_link_for link, text = nil
      /https?:\/\/(?<domain>[a-zA-Z0-9_-]+)\.\w+\// =~ link
      # binding.pry
      h.content_tag :span, class: 'badge' do
         h.content_tag :a, href: link do
            text || domain ;end;end;end;end
