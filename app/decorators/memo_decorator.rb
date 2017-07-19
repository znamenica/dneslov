require 'when_easter'

class MemoDecorator < ApplicationDecorator
   delegate_all

   def <=> other
      self.sorten_date <=> other.sorten_date ;end

   def sorten_date
      @sorten_date ||= (
         /(?<day>\d+)\.(?<month>\d+)/ =~ humanized_date
         sprintf( "%02i%02i", month.to_i, day.to_i )) ;end

   def humanized_date
      year = (Time.zone.now - 13.days).year

      @humanized_date ||=
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
         date ;end;end;end
