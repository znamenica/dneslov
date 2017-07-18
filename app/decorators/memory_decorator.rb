require 'when_easter'

class MemoryDecorator < ApplicationDecorator
   delegate_all

   def date
      # TODO if no proper event, just skip, remove then
      year = (filtered_events.first.try(:happened_at) || "").split(".").last
      year&.strip ;end

   def council_chips
      council.split(',').map do |council|
         /(?<pure_council>[^?]*)\??\z/ =~ council # NOTE crop ? mark
         slugged_chip( nil, pure_council ) end
      .join.html_safe ;end

   def memo_chips_present?
      memos.includes(:calendary).any? { | memo | memo.calendary } ;end

   def memo_chips_each
      memos.map do | memo |
         next if not memo.calendary

         slug = memo.calendary.slug.text
         link = memo.calendary.links.first
         date = memo.date

         yield( memo, link, humanize_date( date ), slug, color_by_slug( slug ) ) ;end;end

   def humanize_date date
      year = (Time.zone.now - 13.days).year
      case date
      when /([^%]+)%(\d+)/ # день недели от даты
         day = $2.to_i
         base_date = Date.parse("#{$1}.#{year}")
         gap = base_date.wday > day && base_date.wday - day || base_date.wday - day + 7
         ( base_date + gap.days ).strftime("%1d.%m")
      when /([+-]\d+)/ # отступ от пасхи
         day = $1.to_i
         easter = WhenEaster::EasterCalendar.find_greek_easter_date(year)
         julian_easter = easter - 13.days # TODO fix to julian date
         ( julian_easter + day.days ).strftime("%1d.%m")
      else
         date
      end
   end

   def default_icon_url
      self.valid_icon_links.first&.url ;end

   def chip
      # slugged_chip( slug_path( order ), order, color_by_slug( slug.text ), slug.text ) ;end;end #TODO
      slugged_chip( nil, order, color_by_slug( slug.text ), slug.text ) ;end;end
