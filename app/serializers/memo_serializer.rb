require 'when_easter'

class MemoSerializer < ApplicationSerializer
   attribute :humanized_date, key: :date

   def julian_gap
      # TODO unfix julian date to dynamic
      13.days ;end

   def <=> other
      self.sorten_date <=> other.sorten_date ;end

   def sorten_date
      @sorten_date ||= (
         /(?<day>\d+)\.(?<month>\d+)/ =~ humanized_date
         sprintf( "%02i%02i", month.to_i, day.to_i )) ;end

   def humanized_date
      year = (Time.zone.now - julian_gap).year

      @humanized_date ||=
      case object.year_date
      when /([^%]+)%(\d+)/ # день недели от даты
         day = $2.to_i
         base_date = Date.parse("#{$1}.#{year}")
         gap = base_date.wday > day && base_date.wday - day || base_date.wday - day + 7
         ( base_date + gap.days ).strftime("%1d.%m")
      when /([+-]\d+)/ # отступ от пасхи
         day = $1.to_i
         easter = WhenEaster::EasterCalendar.find_greek_easter_date(year)
         julian_easter = easter - julian_gap
         ( julian_easter + day.days ).strftime("%1d.%m")
      else
         object.year_date ;end;end;end
