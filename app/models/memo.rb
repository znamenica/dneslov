# frozen_string_literal: true

require 'when_easter'

# class Memo содержит сведения о помине какой-либо памяти в календаре,
# таким образом связывая память и календарь. Может быть либо прямым обычным помином,
# содержащим поле годовой даты year_date, либо соборным помином, таким
# образом указывая на другой помин, содержащий годовую дату и имеющим род собора.
#
# add_date[string]            - дата добавления записи в календарь
# year_date[string]           - дата в году постоянная или перемещаемая, когда память отмечается
# event_id[int]               - ссылка на событие
# calendary_id[int]           - ссылка на календарь
# bind_kind_code[string]      - тип привязки к опорному помину(может быть не привязан)
# bond_to_id[int]             - ссылка на опорный помин, если nil, помин первичный
# id[int]                     - опознаватель
class Memo < ActiveRecord::Base
   extend TotalSize
   extend AsJson

   EXCEPT = %i(created_at updated_at)
   DAYS = %w(нд пн вт ср чт пт сб)
   DAYSR = DAYS.dup.reverse
   DAYSN = DAYS.dup.rotate
   CONDITIONALS = {
      '<' => (1..7),
      '>' => (-7..-1),
      '%' => (0..6),
      '~' => (-3..3),
   }

   belongs_to :calendary
   belongs_to :event
   belongs_to :bond_to, class_name: :Memo
   belongs_to :bind_kind, primary_key: :key, foreign_key: :bind_kind_code, class_name: :Subject

   has_one :memo_order
   has_one :order, through: :memo_order
   has_one :memory, through: :event
   has_one :slug, through: :memory
   has_one :thumb_link, through: :memory, source: :thumb_links
   has_one :calendary_slug, through: :calendary, source: :slug, class_name: :Slug
   has_one :memory_slug, through: :memory, source: :slug, class_name: :Slug

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

   delegate :quantity, to: :memory
   delegate :quantity, to: :bond_to, prefix: true, allow_nil: true
   # alias_method orig, new

   scope :primary, -> { where( bond_to_id: nil ) }
   scope :licit, -> { joins( :calendary ).where( calendaries: { licit: true })}
   scope :licit_with, ->(c) { self.left_outer_joins(:slug).licit.or(self.in_calendaries(c)) }
   scope :in_calendaries, -> calendaries_in do
      return self if calendaries_in.blank?

      # TODO make single embedded select or after fix rails bug use merge
      calendaries = calendaries_in.is_a?(String) && calendaries_in.split(',') || calendaries_in
      calendary_ids = Slug.where( text: calendaries, sluggable_type: 'Calendary' ).select( :sluggable_id )
      where( calendary_id: calendary_ids )
   end

   scope :first_in_calendary, -> do
      sql = self.joins(:calendary_slug, :memory)
                .select('row_number() OVER (PARTITION BY slugs.text, memories.id)')
      self.unscope(:where, :order)
          .joins("INNER JOIN (#{sql.to_sql}) AS tmp ON tmp.row_number = 1 AND tmp.id = memoes.id")
   end

   scope :with_key, -> _ do
      join_name = table.table_alias || table.name
      selector = ["#{join_name}.id AS _key"]

      select(selector).group('_key').reorder("_key")
   end

   scope :with_value, -> context do
      language_codes = [context[:locales]].flatten
      alphabeth_codes = Languageble.alphabeth_list_for(language_codes).flatten
      join_name = table.table_alias || table.name
      selector = self.select_values.dup

      join = "LEFT OUTER JOIN descriptions AS titles
                           ON titles.id IS NOT NULL
                          AND titles.describable_id = #{join_name}.id
                          AND titles.describable_type = 'Memo'
                          AND titles.type = 'Title'
                          AND titles.language_code IN ('#{language_codes.join("', '")}')
                          AND titles.alphabeth_code IN ('#{alphabeth_codes.join("', '")}')

              LEFT OUTER JOIN events AS memo_events
                           ON memo_events.id = #{join_name}.event_id
                         JOIN subjects AS event_kinds
                           ON event_kinds.key = memo_events.kind_code
                          AND event_kinds.kind_code = 'EventKind'
                         JOIN descriptions AS event_titles
                           ON event_titles.id IS NOT NULL
                          AND (event_titles.describable_id = memo_events.id
                          AND event_titles.describable_type = 'Event'
                          AND event_titles.type = 'Title'
                           OR event_titles.describable_id = event_kinds.id
                          AND event_titles.describable_type = 'Subject'
                          AND event_titles.type = 'Appellation')
                          AND event_titles.alphabeth_code IN ('#{alphabeth_codes.join("', '")}')
                          AND event_titles.language_code IN ('#{language_codes.join("', '")}')"

      selector << "memoes.year_date || ' [' || memo_events.happened_at || ' - ' || COALESCE(event_titles.text, '') || ' - ' || COALESCE(titles.text, '') || ']' AS _value"

      joins(join).select(selector).group(:id, "titles.text", "memo_events.happened_at", "event_titles.text")
   end

   scope :with_slug_text, -> do
      selector = self.select_values.dup
      if selector.empty?
         selector << 'memoes.*'
      end
      selector << 'slugs.text AS _slug'

      left_outer_joins(:slug).select(selector.uniq).group('_slug').order('_slug')
   end

   scope :by_date, ->(dates_in, julian = false) do
      return self if dates_in.blank?

      result = Memo.dates_to_days(dates_in, julian)

      if !date.leap?
         result |= result.grep(/28\.02[%<>~]?/).map do |date|
            match = date.match(/([%<>~])/)
            match.present? && "29.02#{match[1]}#{wday}" || "29.02"
         end
      end

      where(year_date: result)
   end

   scope :by_token, -> text do
      left_outer_joins( :descriptions, :titles, :memory ).
         where( "descriptions.text ~* ?", "\\m#{text}.*" ).or(
         where( "titles_memoes.text ~* ?", "\\m#{text}.*" ).or(
         where( "memories.short_name ~* ?", "\\m#{text}.*" ).or(
         where( "memoes.add_date ~* ?", "\\m#{text}.*" ).or(
         where( "memoes.year_date ~* ?", "\\m#{text}.*" )))))
   end

   scope :by_tokens, -> string_in do
      return self if string_in.blank?
      # TODO fix the correctness of the query
      klass = self.model_name.name.constantize
      or_rel_tokens = string_in.split(/\//).map do |or_token|
         # OR operation
         or_token.strip.split(/\s+/).reduce(nil) do |rel, and_token|
            # AND operation
            and_rel = klass.by_token(and_token)
            rel && rel.merge(and_rel) || and_rel
         end
      end

      or_rel = or_rel_tokens.reduce { |sum_rel, rel| sum_rel.or(rel) }
      self.merge(or_rel).distinct
   end

   scope :by_event_id, -> (event_id) do
      where(event_id: event_id)
   end

   scope :by_calendary_id, -> (calendary_id) do
      where(calendary_id: calendary_id)
   end

   scope :notice, -> { joins(:event).merge(Event.notice) }

   singleton_class.send(:alias_method, :t, :by_token)
   singleton_class.send(:alias_method, :q, :by_tokens)
   singleton_class.send(:alias_method, :d, :by_date)
   singleton_class.send(:alias_method, :c, :in_calendaries)

   scope :distinct_by, -> *args do
      _selector = self.select_values.dup
      if _selector.empty?
        _selector << "ON (#{args.join(', ')}) memoes.*"
      else
         selector = _selector.uniq
         selector.unshift( "ON (#{args.join(', ')}) " + selector.shift )
      end

      rela = self.distinct
      rela.select_values = selector
      rela
   end

   scope :with_event, -> do
      selector = 'order_table.order_no AS _event_code'
      list = Event::SORT.map.with_index {|x, i| "('#{x}', #{i})" }
      join = "LEFT OUTER JOIN (VALUES #{list.join(", ")})
              AS order_table (event_kind_code, order_no)
              ON order_table.event_kind_code = events.kind_code"

      joins(:event, join).select(selector).group('_event_code').order('_event_code')
   end

   scope :with_base_year, -> do
      selector = self.select_values.dup
      if selector.empty?
         selector << 'memoes.*'
      end
      selector << 'memories.base_year AS _base_year'

      joins(:memory).select(selector).group('_base_year').order('_base_year')
   end

   scope :with_date, -> do
      selector = 'events.happened_at AS _happened_at'

      joins(:event).select(selector).group('_happened_at')
   end

   scope :with_thumb_url, -> do
      selector = 'links.url AS _thumb_url'

      left_outer_joins(:thumb_link).select(selector).group('_thumb_url')
   end

   scope :with_bond_to_title, -> language_code do
      selector = 'bond_memo_titles_memoes.text AS _bond_to_title'

      left_outer_joins(:bond_memo_titles).select(selector).group('_bond_to_title')
   end

   scope :with_event_title, -> language_code do
      selector = 'event_titles_memoes.text AS _event_title'

      left_outer_joins(:event_titles).select(selector).group('_event_title')
   end

   scope :with_calendary_slug_text, -> do
      selector = 'calendary_slugs_memoes.text AS _calendary_slug'

      left_outer_joins(:calendary_slug).select(selector).group('_calendary_slug')
   end

   scope :with_orders, -> language_code do
      selector = "COALESCE(jsonb_object_agg(DISTINCT slugs_memoes.text || '', order_titles_memoes.text)
         FILTER (WHERE slugs_memoes.id IS NOT NULL AND order_titles_memoes.id IS NOT NULL), '{}') AS _orders"

      left_outer_joins(:slugs, :order_titles).select(selector)
   end

   scope :with_slug, -> do
      selector = self.select_values.dup
      if selector.empty?
         selector << 'memoes.*'
      end
      selector << 'slugs.text AS _slug'

      left_outer_joins(:slug).select(selector.uniq).group('_slug').order('_slug')
   end

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

      joins(join).select(selector.uniq).group('_description')
   end

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

      joins(join).select(selector.uniq).group('_title')
   end

   scope :with_pure_links, -> do
      selector = "COALESCE((SELECT jsonb_agg(links)
                              FROM links
                             WHERE links.info_id = memories.id
                               AND links.info_type = 'Memory'), '[]'::jsonb) AS _links"

      select(selector).group(:id)
   end

   scope :with_bond_to_year_date, -> context do
      language_codes = [ context[:locales] ].flatten
      alphabeth_codes = Languageble.alphabeth_list_for(language_codes).flatten
      selector = self.select_values.dup
      if selector.empty?
         selector << 'memoes.*'
      end

      join = "LEFT OUTER JOIN memoes AS bond_to_memoes
                           ON memoes.bond_to_id = bond_to_memoes.id

              LEFT OUTER JOIN descriptions AS titles
                           ON titles.id IS NOT NULL
                          AND titles.describable_id = bond_to_memoes.id
                          AND titles.describable_type = 'Memo'
                          AND titles.type = 'Title'
                          AND titles.language_code IN ('#{language_codes.join("', '")}')
                          AND titles.alphabeth_code IN ('#{alphabeth_codes.join("', '")}')

              LEFT OUTER JOIN events AS bond_to_memo_events
                           ON bond_to_memo_events.id = bond_to_memoes.event_id
              LEFT OUTER JOIN subjects AS bond_to_event_kinds
                           ON bond_to_event_kinds.key = bond_to_memo_events.kind_code
                          AND bond_to_event_kinds.kind_code = 'EventKind'
              LEFT OUTER JOIN descriptions AS bond_to_event_titles
                           ON bond_to_event_titles.id IS NOT NULL
                          AND (bond_to_event_titles.describable_id = bond_to_memo_events.id
                          AND bond_to_event_titles.describable_type = 'Event'
                          AND bond_to_event_titles.type = 'Title'
                           OR bond_to_event_titles.describable_id = bond_to_event_kinds.id
                          AND bond_to_event_titles.describable_type = 'Subject'
                          AND bond_to_event_titles.type = 'Appellation')
                          AND bond_to_event_titles.alphabeth_code IN ('#{alphabeth_codes.join("', '")}')
                          AND bond_to_event_titles.language_code IN ('#{language_codes.join("', '")}')"

      selector << "                    bond_to_memoes.year_date ||
                                                           ' [' ||
                  COALESCE(bond_to_memo_events.happened_at, '') ||
                                                          ' - ' ||
                        COALESCE(bond_to_event_titles.text, '') ||
                                                          ' - ' ||
                                      COALESCE(titles.text, '') ||
                  ']' AS _bond_to_year_date"

      joins(join).select(selector).group(:id,
                                         "bond_to_memoes.year_date",
                                         "titles.text",
                                         "bond_to_memo_events.happened_at",
                                         "bond_to_event_titles.text")
   end

   scope :with_memo_orders, -> context do
      language_codes = [ context[:locales] ].flatten
      selector = self.select_values.dup
      if selector.empty?
         selector << 'memoes.*'
      end
      selector << "COALESCE((WITH __memo_orders AS (
                      SELECT DISTINCT ON(memo_orders.order_id)
                             memo_orders.id AS id,
                             memo_orders.order_id AS order_id,
                             memo_order_titles.text AS order
                        FROM memo_orders
             LEFT OUTER JOIN orders
                          ON orders.id = memo_orders.order_id
                        JOIN descriptions AS memo_order_titles
                          ON memo_order_titles.describable_id = orders.id
                         AND memo_order_titles.describable_type = 'Order'
                         AND memo_order_titles.type = 'Note'
                         AND memo_order_titles.language_code IN ('#{language_codes.join("', '")}')
                       WHERE memoes.id = memo_orders.memo_id
                    GROUP BY memo_orders.id, memo_order_titles.text)
                      SELECT jsonb_agg(__memo_orders)
                        FROM __memo_orders), '[]'::jsonb) AS _memo_orders"

      select(selector).group(:id)
   end

   scope :with_calendary_title, -> context do
      language_codes = [ context[:locales] ].flatten
      selector = self.select_values.dup
      if selector.empty?
         selector << 'memoes.*'
      end
      selector << 'calendary_titles.text AS _calendary_title'

      join = "LEFT OUTER JOIN calendaries
                           ON calendaries.id = memoes.calendary_id
              LEFT OUTER JOIN descriptions AS calendary_titles
                           ON calendary_titles.describable_id = calendaries.id
                          AND calendary_titles.describable_type = 'Calendary'
                          AND calendary_titles.type = 'Appellation'
                          AND calendary_titles.language_code IN ('#{language_codes.join("', '")}')"

      joins(join).select(selector).group(:id, 'calendary_titles.text')
   end

   scope :with_memory_event, -> context do
      language_codes = [ context[:locales] ].flatten
      selector = self.select_values.dup
      if selector.empty?
         selector << 'memoes.*'
      end
      [
        "memo_event_memories.id AS _memory_id",
        "memo_event_memories.short_name AS _memory_name",
        "event_kind_titles.text || ' (' || memo_events.happened_at || ')' AS _event_short_title"
      ].reduce(selector) { |s, v| s << v }

      join = "LEFT OUTER JOIN events AS memo_events
                           ON memoes.event_id = memo_events.id
                         JOIN memories AS memo_event_memories
                           ON memo_events.memory_id = memo_event_memories.id
              LEFT OUTER JOIN subjects AS event_kinds
                           ON event_kinds.kind_code = 'EventKind'
                          AND event_kinds.key = memo_events.kind_code
              LEFT OUTER JOIN descriptions AS event_kind_titles
                           ON event_kind_titles.describable_id = event_kinds.id
                          AND event_kind_titles.describable_type = 'Subject'
                          AND event_kind_titles.type = 'Appellation'
                          AND event_kind_titles.language_code IN ('#{language_codes.join("', '")}')"

      joins(join).select(selector).group(:id, 'memo_event_memories.id',
                                              'memo_events.happened_at',
                                              'event_kind_titles.text')
   end

   scope :with_descriptions, -> context do
      language_codes = [ context[:locales] ].flatten
      alphabeth_codes = Languageble.alphabeth_list_for( language_codes ).flatten
      selector = self.select_values.dup
      if self.select_values.dup.empty?
         selector << 'memoes.*'
      end

      selector << "COALESCE((WITH __descriptions AS (
                      SELECT DISTINCT ON(descriptions.id)
                             descriptions.id AS id,
                             descriptions.type AS type,
                             descriptions.text AS text,
                             descriptions.language_code AS language_code,
                             descriptions.alphabeth_code AS alphabeth_code,
                             language_names.text AS language,
                             alphabeth_names.text AS alphabeth
                        FROM descriptions
             LEFT OUTER JOIN subjects AS languages
                          ON languages.key = descriptions.language_code
                        JOIN descriptions AS language_names
                          ON language_names.describable_id = languages.id
                         AND language_names.describable_type = 'Subject'
                         AND language_names.language_code IN ('#{language_codes.join("', '")}')
             LEFT OUTER JOIN subjects AS alphabeths
                          ON alphabeths.key = descriptions.alphabeth_code
                        JOIN descriptions AS alphabeth_names
                          ON alphabeth_names.describable_id = alphabeths.id
                         AND alphabeth_names.describable_type = 'Subject'
                         AND alphabeth_names.alphabeth_code IN ('#{alphabeth_codes.join("', '")}')
                       WHERE descriptions.describable_id = memoes.id
                         AND descriptions.describable_type = 'Memo'
                         AND descriptions.type IN ('Title', 'Description')
                    GROUP BY descriptions.id, language_names.text, alphabeth_names.text)
                      SELECT jsonb_agg(__descriptions)
                        FROM __descriptions), '[]'::jsonb) AS _descriptions"

      select(selector).group(:id)
   end

   scope :with_links, -> context do
      language_codes = [ context[:locales] ].flatten
      alphabeth_codes = Languageble.alphabeth_list_for( language_codes ).flatten
      selector = self.select_values.dup
      if self.select_values.dup.empty?
         selector << 'memoes.*'
      end

      selector << "COALESCE((with __links as (
                      SELECT DISTINCT ON(links.id)
                             links.id as id,
                             links.type as type,
                             links.url as url,
                             links.language_code AS language_code,
                             links.alphabeth_code AS alphabeth_code,
                             language_names.text AS language,
                             alphabeth_names.text AS alphabeth
                        FROM links
             LEFT OUTER JOIN subjects AS languages
                          ON languages.key = links.language_code
                        JOIN descriptions AS language_names
                          ON language_names.describable_id = languages.id
                         AND language_names.describable_type = 'Subject'
                         AND language_names.language_code IN ('#{language_codes.join("', '")}')
             LEFT OUTER JOIN subjects AS alphabeths
                          ON alphabeths.key = links.alphabeth_code
                        JOIN descriptions AS alphabeth_names
                          ON alphabeth_names.describable_id = alphabeths.id
                         AND alphabeth_names.describable_type = 'Subject'
                         AND alphabeth_names.alphabeth_code IN ('#{alphabeth_codes.join("', '")}')
                       WHERE links.info_id = memoes.id
                         AND links.info_type = 'Memo'
                    GROUP BY links.id, language_names.text, alphabeth_names.text)
                      SELECT jsonb_agg(__links)
                        FROM __links), '[]'::jsonb) AS _links"

      select(selector).group(:id)
   end

   accepts_nested_attributes_for :service_links, reject_if: :all_blank, allow_destroy: true
   accepts_nested_attributes_for :services, reject_if: :all_blank, allow_destroy: true
   accepts_nested_attributes_for :titles, reject_if: :all_blank, allow_destroy: true
   accepts_nested_attributes_for :descriptions, reject_if: :all_blank, allow_destroy: true
   accepts_nested_attributes_for :links, reject_if: :all_blank, allow_destroy: true
   accepts_nested_attributes_for :memo_orders, reject_if: :all_blank, allow_destroy: true

   validates_presence_of :calendary, :event
   validates_presence_of :year_date, unless: :bond_to_quantity
   validates_absence_of :year_date, if: :bond_to_quantity
   validates :year_date, format: { with: /\A((0[1-9]|[1-2][0-9]|3[0-1])\.(0[1-9]|1[0-2])([%<>~][0-6])?|[+-]\d{1,3})\z/ }, if: :year_date

   before_validation :fix_year_date
   before_save -> { self.bind_kind_code ||= 'несвязаный' }, on: :create

   class << self
      def dates_to_days dates_in, julian
         [dates_in].flatten.map do |date_in|
            date = date_in.is_a?(Date) && date_in || Date.parse(date_in)
            new_date = date.strftime('%2d.%m')
            gap = julian && 13.days || 0
            wday = (date + gap).wday
            easter = WhenEaster::EasterCalendar.find_greek_easter_date(date.year) - gap

            relays =
               CONDITIONALS.map do |(cond, range)|
                  range.map { |x| (date - x.days).strftime('%2d.%m') + "#{cond}#{wday}" }
               end.flatten

            [relays, new_date, format('%+i', date.to_time.yday - easter.yday)]
         end.flatten.uniq
      end
   end

   def year_date_for year
      case year_date
      when /(?<sign>[+-])(?<indent>.*)/
         mul = sign == '-' && -1 || 1
         WhenEaster::EasterCalendar.find_greek_easter_date(year.to_i) + (mul * indent.to_i).days
      when /(?<year_m>.*)%(?<date_m>.*)/
         date = Date.parse([year_m, year].join('.'))
         gap_in = date_m.to_i - date.wday
         gap = gap_in.negative? && gap_in + 7 || gap_in

         date + gap.days
      else
         Date.parse([year_date, year].join('.'))
      end
   rescue StandardError
      Time.at(0)
   end

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
      when /^дн\.(\d+)\.с (\d+\.\d+)$/   #29.06%7
         daynum = DAYS.index($1)
         date = Time.parse("#{$2}.1970")
         "#{date.strftime("%1d.%m")}%#{daynum}"
      when /^дн\.(\d+)\.по (\d+\.\d+)$/   #29.06<7
         date = Time.parse("#{$2}.1970") + $1.to_i
         date.strftime("%1d.%m")
      when /^(#{DAYS.join("|")})\.близ (\d+\.\d+)$/   #29.06~7
         daynum = DAYS.index($1)
         date = Time.parse("#{$2}.1970") # - 4.days
         "#{date.strftime("%1d.%m")}~#{daynum}"
      when /^(#{DAYS.join("|")})\.по (\d+\.\d+)$/   #29.06<7
         daynum = DAYS.index($1)
         date = Time.parse("#{$2}.1970")
         "#{date.strftime("%1d.%m")}<#{daynum}"
      when /^(#{DAYS.join("|")})\.до (\d+\.\d+)$/  #21.06>7
         daynum = DAYS.index($1)
         date = Time.parse("#{$2}.1970")# - 8.days
         "#{date.strftime("%1d.%m")}>#{daynum}"
      when /^(#{DAYS.join("|")})\.(\d+)\.по (\d+\.\d+)$/   #29.06<7
         daynum = DAYS.index($1)
         date = Time.parse("#{$3}.1970") + ($2.to_i - 1) * 7
         "#{date.strftime("%1d.%m")}<#{daynum}"
      when /^(#{DAYS.join("|")})\.(\d+)\.до (\d+\.\d+)$/  #21.06>7
         daynum = DAYS.index($1)
         date = Time.parse("#{$3}.1970") - 8.days - ($2.to_i - 1) * 7
         "#{date.strftime("%1d.%m")}>#{daynum}"
      when /^$/
         nil
      else
         self.year_date
      end
   end
end
