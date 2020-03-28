require 'when_easter'

# add_date[string]      - дата добавления записи в календарь
# year_date[string]     - дата в году постоянная или перемещаемая, когда память отмечается
# event_id[int]         - ссылка на событие
# calendary_id[int]     - ссылка на календарь
# bind_kind[string]     - тип привязки к опорному помину(может быть не привязан)
# bond_to_id[int]       - ссылка на опорный помин, если nil, помин первичный
#
class Memo < ActiveRecord::Base
   DAYS = %w(нд пн вт ср чт пт сб)
   DAYSR = DAYS.dup.reverse
   DAYSN = DAYS.dup.rotate

   belongs_to :calendary
   belongs_to :event
   belongs_to :bond_to, class_name: :Memo

   has_many :service_links, as: :info, inverse_of: :info #ЧИНЬ превод во services
   has_many :services, as: :info, inverse_of: :info
   has_many :descriptions, -> { desc }, as: :describable, dependent: :delete_all
   has_many :titles, -> { title }, as: :describable, dependent: :delete_all
   has_many :links, as: :info, dependent: :delete_all, class_name: :BeingLink
   has_many :memo_orders
   has_many :orders, through: :memo_orders
   has_one :memo_order
   has_one :order, through: :memo_order
   has_one :memory, through: :event

   #enum bind_kind: [ 'несвязаный', 'навечерие', 'предпразднество', 'попразднество' ]

   scope :primary, -> { where( bond_to_id: nil ) }
   scope :licit, -> { joins( :calendary ).where( calendaries: { licit: true })}
   scope :in_calendaries, -> calendaries_in do
      # TODO make single embedded select or after fix rails bug use merge
      calendaries = calendaries_in.is_a?(String) && calendaries_in.split(',') || calendaries_in
      calendary_ids = Slug.where( text: calendaries, sluggable_type: 'Calendary' ).pluck( :sluggable_id )
      where( calendary_id: calendary_ids ) ;end

   scope :with_date, -> (date_in, julian = false) do
      return self if date_in.blank?

      date = date_in.is_a?(Date) && date_in || Date.parse(date_in)
      new_date = date.strftime("%2d.%m")
      gap = (julian && 13.days || 0)
      wday = (date + gap).wday
      relays = (1..7).map { |x| (date - x.days).strftime("%2d.%m") + "%#{wday}" }
      easter = WhenEaster::EasterCalendar.find_greek_easter_date(date.year) - gap
      days = sprintf( "%+i", date.to_time.yday - easter.yday )
      result = relays.dup << new_date << days

      if !date.leap?
         if result.grep('28.02').present?
            result << "29.02"
         elsif result.grep(/28\.02%/).present?
            result << "29.02%#{wday}" ;end;end

      where( year_date: result ) ;end

   scope :with_token, -> text do
      #SELECT  DISTINCT  "memoes".* FROM "memoes","events","descriptions","calendaries" WHERE (("descriptions"."describable_id" = "memoes"."id" AND "descriptions"."describable_type" = 'Memo') OR ("memoes"."calendary_id" = "descriptions"."describable_id" AND "descriptions"."describable_type" = 'Calendary') OR ("memoes"."event_id" = "events"."id" AND "events"."memory_id" = "descriptions"."describable_id" AND "descriptions"."describable_type" = 'Memory')) AND descriptions.text ILIKE '%Азарьин%'; TODO + names
      #
#                                      merge(Calendary.with_token(text)).or(
#            left_outer_joins(:memory).merge(Memory.with_token(text)))))) ;end
      left_outer_joins(:descriptions, :memory)
         .where("descriptions.text ILIKE ?", "%#{text}%").or(
          where("memoes.add_date ILIKE ?", "%#{text}%").or(
          where("memoes.year_date ILIKE ?", "%#{text}%").or(
          where("memories.short_name ILIKE ?", "%#{text}%")))) ;end

   scope :with_tokens, -> string_in do
      return self if string_in.blank?
      # TODO fix the correctness of the query
      klass = self.model_name.name.constantize
      rel_in = left_outer_joins( :memory, :descriptions ).where( 'FALSE' )
      string_in.split(/\//).reduce(rel_in) do |rel, or_token|
         or_rel = or_token.strip.split(/\s+/).reduce(nil) do |rel, and_token|
            # AND operation
            and_rel = klass.with_token(and_token)
            rel && rel.merge(and_rel) || and_rel ;end
         # OR operation
         rel.or(or_rel);end
      .distinct ;end


   scope :with_event_id, -> (event_id) do
      where(event_id: event_id) ;end

   scope :with_calendary_id, -> (calendary_id) do
      where(calendary_id: calendary_id) ;end

   scope :notice, -> { joins(:event).merge(Event.notice) }

   singleton_class.send(:alias_method, :t, :with_token)
   singleton_class.send(:alias_method, :q, :with_tokens)
   singleton_class.send(:alias_method, :d, :with_date)
   singleton_class.send(:alias_method, :c, :in_calendaries)

   accepts_nested_attributes_for :service_links, reject_if: :all_blank
   accepts_nested_attributes_for :services, reject_if: :all_blank
   accepts_nested_attributes_for :titles, reject_if: :all_blank, allow_destroy: true
   accepts_nested_attributes_for :descriptions, reject_if: :all_blank, allow_destroy: true
   accepts_nested_attributes_for :links, reject_if: :all_blank, allow_destroy: true

   validates_presence_of :calendary, :event
   validates :year_date, format: { with: /\A((0[1-9]|[1-2][0-9]|3[0-1])\.(0[1-9]|1[0-2])(%[0-6])?|[+-]\d{1,3})\z/ }

   before_validation :fix_year_date
   before_create -> { self.bind_kind ||= 'несвязаный' }

   def fix_year_date
      self.year_date =
      case self.year_date
      when /пасха/
         "+0"
      when /^дн\.(\d+)\.по пасхе/ #+24
         "+#{$1}"
      when /^дн\.(\d+)\.до пасхи/ #-24
         "-#{$1}"
      when /^(#{DAYS.join("|")})\.(\d+)\.по пасхе/ #+70
         daynum = DAYSN.index($1) + 1
         days = ($2.to_i - 1) * 7 + daynum
         "+#{days}"
      when /^(#{DAYS.join("|")})\.по пасхе/    #+7
         daynum = DAYSN.index($1) + 1
         "+#{daynum}"
      when /^(#{DAYS.join("|")})\.(\d+)\.до пасхи/  #-14
         daynum = DAYSR.index($1) + 1
         days = ($2.to_i - 1) * 7 + daynum
         "-#{days}"
      when /^(#{DAYS.join("|")})\.до пасхи/    #-7
         daynum = DAYSR.index($1) + 1
         "-#{daynum}"
      when /^дн\.(\d+)\.по (\d+\.\d+)$/   #29.06%7
         date = Time.parse("#{$2}.1970") + $1.to_i
         date.strftime("%1d.%m")
      when /^(#{DAYS.join("|")})\.близ (\d+\.\d+)$/   #29.06%7
         daynum = DAYS.index($1)
         date = Time.parse("#{$2}.1970") - 4.days
         "#{date.strftime("%1d.%m")}%#{daynum}"
      when /^(#{DAYS.join("|")})\.по (\d+\.\d+)$/   #29.06%7
         daynum = DAYS.index($1)
         date = Time.parse("#{$2}.1970")
         "#{date.strftime("%1d.%m")}%#{daynum}"
      when /^(#{DAYS.join("|")})\.до (\d+\.\d+)$/  #21.06%7
         daynum = DAYS.index($1)
         date = Time.parse("#{$2}.1970") - 8.days
         "#{date.strftime("%1d.%m")}%#{daynum}"
      when /^(#{DAYS.join("|")})\.(\d+)\.по (\d+\.\d+)$/   #29.06%7
         daynum = DAYS.index($1)
         date = Time.parse("#{$3}.1970") + ($2.to_i - 1) * 7
         "#{date.strftime("%1d.%m")}%#{daynum}"
      when /^(#{DAYS.join("|")})\.(\d+)\.до (\d+\.\d+)$/  #21.06%7
         daynum = DAYS.index($1)
         date = Time.parse("#{$3}.1970") - 8.days - ($2.to_i - 1) * 7
         "#{date.strftime("%1d.%m")}%#{daynum}"
      else
         self.year_date ;end;end

   def link_for language_code
      links.where(language_code: language_code).first ;end

   def calendary_string= value
      self.calendary = Calendary.includes(:slug).where(slugs: { text: value }).first ;end

   def title_for language_code
      titles.where(language_code: language_code).first ;end

   def description_for language_code
      descriptions.where(language_code: language_code).first ;end;end
