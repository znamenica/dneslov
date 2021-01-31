require 'when_easter'

# add_date[string]      - дата добавления записи в календарь
# year_date[string]     - дата в году постоянная или перемещаемая, когда память отмечается
# event_id[int]         - ссылка на событие
# calendary_id[int]     - ссылка на календарь
# bind_kind_code[string]     - тип привязки к опорному помину(может быть не привязан)
# bond_to_id[int]       - ссылка на опорный помин, если nil, помин первичный
#
class Memo < ActiveRecord::Base
   DAYS = %w(нд пн вт ср чт пт сб)
   DAYSR = DAYS.dup.reverse
   DAYSN = DAYS.dup.rotate

   belongs_to :calendary
   belongs_to :event
   belongs_to :bond_to, class_name: :Memo
   belongs_to :bind_kind, primary_key: :key, foreign_key: :bind_kind_code, class_name: :Subject

   has_one :calendary_slug, through: :calendary, source: :slug, class_name: :Slug
   has_one :memo_order
   has_one :order, through: :memo_order
   has_one :memory, through: :event
   has_one :slug, through: :memory
   has_one :thumb_link, through: :memory, source: :thumb_links

   has_many :memo_orders, dependent: :destroy
   has_many :orders, through: :memo_orders
   has_many :slugs, -> { distinct.reorder('id') }, through: :orders, source: :slug
   has_many :order_titles, through: :orders, source: :tweets
   has_many :bond_memo_titles, through: :bond_to, source: :titles
   has_many :event_titles, through: :event, source: :titles
   has_many :service_links, as: :info, inverse_of: :info #ЧИНЬ превод во services
   has_many :services, as: :info, inverse_of: :info
   has_many :descriptions, -> { where( type: :Description ).desc }, as: :describable, dependent: :delete_all
   has_many :titles, -> { title }, as: :describable, dependent: :delete_all
   has_many :links, as: :info, dependent: :delete_all, class_name: :BeingLink

   scope :primary, -> { where( bond_to_id: nil ) }
   scope :licit, -> { joins( :calendary ).where( calendaries: { licit: true })}
   scope :licit_with, ->(c) { self.left_outer_joins(:slug).licit.or(self.in_calendaries(c)) }
   scope :in_calendaries, -> calendaries_in do
      return self if calendaries_in.blank?

      # TODO make single embedded select or after fix rails bug use merge
      calendaries = calendaries_in.is_a?(String) && calendaries_in.split(',') || calendaries_in
      calendary_ids = Slug.where( text: calendaries, sluggable_type: 'Calendary' ).select( :sluggable_id )
      where( calendary_id: calendary_ids ) end

   scope :first_in_calendary, -> do
      sql = self.joins(:calendary_slug, :memory)
                .select('row_number() OVER (PARTITION BY slugs.text, memories.id)')
      self.unscope(:where, :order)
          .joins("INNER JOIN (#{sql.to_sql}) AS tmp ON tmp.row_number = 1 AND tmp.id = memoes.id") end

   scope :by_date, -> (date_in, julian = false) do
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

   scope :by_token, -> text do
      left_outer_joins( :descriptions, :titles, :memory ).
         where( "descriptions.text ~* ?", "\\m#{text}.*" ).or(
         where( "titles_memoes.text ~* ?", "\\m#{text}.*" ).or(
         where( "memories.short_name ~* ?", "\\m#{text}.*" ).or(
         where( "memoes.add_date ~* ?", "\\m#{text}.*" ).or(
         where( "memoes.year_date ~* ?", "\\m#{text}.*" ))))) end

   scope :by_tokens, -> string_in do
      return self if string_in.blank?
      # TODO fix the correctness of the query
      klass = self.model_name.name.constantize
      or_rel_tokens = string_in.split(/\//).map do |or_token|
         # OR operation
         or_token.strip.split(/\s+/).reduce(nil) do |rel, and_token|
            # AND operation
            and_rel = klass.by_token(and_token)
            rel && rel.merge(and_rel) || and_rel ;end;end
      or_rel = or_rel_tokens.reduce { |sum_rel, rel| sum_rel.or(rel) }
      self.merge(or_rel).distinct ;end

   scope :by_event_id, -> (event_id) do
      where(event_id: event_id) ;end

   scope :by_calendary_id, -> (calendary_id) do
      where(calendary_id: calendary_id) ;end

   scope :notice, -> { joins(:event).merge(Event.notice) }

   singleton_class.send(:alias_method, :t, :by_token)
   singleton_class.send(:alias_method, :q, :by_tokens)
   singleton_class.send(:alias_method, :d, :by_date)
   singleton_class.send(:alias_method, :c, :in_calendaries)

   scope :distinct_by, -> *args do
      _selector = self.select_values.dup
      if _selector.empty?
        _selector << "DISTINCT ON (#{args.join(', ')}) memoes.*"
      else
         selector = _selector.uniq
         selector.unshift( "DISTINCT ON (#{args.join(', ')}) " + selector.shift )
      end

      self.select_values = selector
      self ;end

   scope :with_event, -> do
      selector = 'order_table.order_no AS _event_code'
      list = Event::SORT.map.with_index {|x, i| "('#{x}', #{i})" }
      join = "LEFT OUTER JOIN (VALUES #{list.join(", ")})
              AS order_table (event_kind_code, order_no)
              ON order_table.event_kind_code = events.kind_code"

      joins(:event, join).select(selector).group('_event_code').order('_event_code') ;end

   scope :with_base_year, -> do
      selector = self.select_values.dup
      if selector.empty?
         selector << 'memoes.*'
      end
      selector << 'memories.base_year AS _base_year'


      joins(:memory).select(selector).group('_base_year').order('_base_year') ;end

   scope :with_date, -> do
      selector = 'events.happened_at AS _happened_at'

      joins(:event).select(selector).group('_happened_at') ;end

   scope :with_thumb_url, -> do
      selector = 'links.url AS _thumb_url'

      left_outer_joins(:thumb_link).select(selector).group('_thumb_url') ;end

   scope :with_bond_to_title, -> language_code do
      selector = 'bond_memo_titles_memoes.text AS _bond_to_title'

      left_outer_joins(:bond_memo_titles).select(selector).group('_bond_to_title') ;end

   scope :with_event_title, -> language_code do
      selector = 'event_titles_memoes.text AS _event_title'

      left_outer_joins(:event_titles).select(selector).group('_event_title') ;end

   scope :with_calendary_slug, -> do
      selector = 'calendary_slugs_memoes.text AS _calendary_slug'

      left_outer_joins(:calendary_slug).select(selector).group('_calendary_slug') ;end

   scope :with_orders, -> language_code do
      selector = 'jsonb_object_agg(DISTINCT slugs_memoes.text, order_titles_memoes.text) AS _orders'

      left_outer_joins(:slugs, :order_titles).select(selector) ;end

   scope :with_slug, -> do
      selector = self.select_values.dup
      if selector.empty?
         selector << 'memoes.*'
      end
      selector << 'slugs.text AS _slug'

      left_outer_joins(:slug).select(selector.uniq).group('_slug').order('_slug') ;end

   scope :with_description, -> language_code do
      selector = self.select_values.dup
      if selector.empty?
         selector << 'memoes.*'
      end
      selector << 'descriptions.text AS _description'
      language_codes = [ language_code ].flatten
      join = "LEFT OUTER JOIN descriptions ON descriptions.describable_id = memoes.id
                          AND descriptions.describable_type = 'Memo'
                          AND descriptions.type = 'Description'
                          AND descriptions.language_code IN ('#{language_codes.join("', '")}')"

      joins(join).select(selector.uniq).group('_description') ;end

   scope :with_title, -> language_code do
      selector = self.select_values.dup
      if selector.empty?
         selector << 'memoes.*'
      end
      selector << 'titles.text AS _title'
      language_codes = [ language_code ].flatten
      join = "LEFT OUTER JOIN descriptions AS titles ON titles.describable_id = memoes.id
                          AND titles.describable_type = 'Memo'
                          AND titles.type = 'Title'
                          AND titles.language_code IN ('#{language_codes.join("', '")}')"

      joins(join).select(selector.uniq).group('_title') ;end

   accepts_nested_attributes_for :service_links, reject_if: :all_blank, allow_destroy: true
   accepts_nested_attributes_for :services, reject_if: :all_blank, allow_destroy: true
   accepts_nested_attributes_for :titles, reject_if: :all_blank, allow_destroy: true
   accepts_nested_attributes_for :descriptions, reject_if: :all_blank, allow_destroy: true
   accepts_nested_attributes_for :links, reject_if: :all_blank, allow_destroy: true
   accepts_nested_attributes_for :memo_orders, reject_if: :all_blank, allow_destroy: true

   validates_presence_of :calendary, :event
   validates :year_date, format: { with: /\A((0[1-9]|[1-2][0-9]|3[0-1])\.(0[1-9]|1[0-2])(%[0-6])?|[+-]\d{1,3})\z/ }

   before_validation :fix_year_date
   before_save -> { self.bind_kind_code ||= 'несвязаный' }, on: :create

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

   class << self
      def total_size
         #TODO optimize
         unlimited = self.except(:limit, :offset)
         unlimited[0] && unlimited.size
      end
   end

   def titles_for language_code
      titles.where( language_code: language_code ) ;end

   def descriptions_for language_code
      descriptions.where( language_code: language_code ) ;end

   def link_for language_code
      links.where(language_code: language_code).first ;end

   def calendary_string= value
      self.calendary = Calendary.includes(:slug).where(slugs: { text: value }).first ;end

   def title_for language_code
      titles_for( language_code ).first ;end

   def description_for language_code
      descriptions_for( language_code ).first ;end;end
