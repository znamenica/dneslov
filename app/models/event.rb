# kind_code[string]   наименование класса события
# memory_id[int] id памяти, событие которой произошло
# place_id[int]  id места, где произошло событие
# item_id[int]   id предмета, к которому применяется событие
#    t.string "happened_at"
#    t.string "person_name"
#    t.integer "type_number"
#    t.string "order"
#    t.string "council"
#
class Event < ActiveRecord::Base
   extend Informatible
   extend TotalSize
   include WithTitles
   include WithDescriptions

   NOTICE = [
      'Repose',
      'Veneration',
      'Writing',
      'Appearance',
      'Council',
      'Miracle',
   ]

   USUAL = [
      'Marriage',
      'Exaltation',
      'Ascension',
      'Restoration',
      'Resurrection',
      'Entrance',
      'Conception',
      'Protection',
      'Conceiving',
      'Writing',
      'Sanctification',
      'Uncovering',
      'Circumcision',
      'Revival',
      'Renunciation',
      'Placing',
      'Translation',
      'Adoration',
      'Transfiguration',
      'Repose',
      'Nativity',
      'Council',
      'Meeting',
      'Passion',
      'Supper',
      'Assurance',
      'Miracle',
      'Appearance',
   ]

   SORT = [
      'Genum',
      'Nativity',
      'Resurrection',
   ]

   belongs_to :memory
   belongs_to :place, optional: true
   belongs_to :item, optional: true
   belongs_to :kind, primary_key: :key, foreign_key: :kind_code, class_name: :Subject
   has_one :coordinate, as: :info, inverse_of: :info, class_name: :CoordLink
   has_many :kind_titles, through: :kind, source: :names
   has_many :thumbs, -> { where(thumbs: { thumbable_type: "Event" }) }, foreign_key: :thumbable_id, dependent: :destroy
   has_many :attitudes, as: :imageable, class_name: :ImageAttitude
   has_many :pictures, through: :attitudes
   has_many :memos, dependent: :delete_all do
      def for calendary_slugs = nil
         if calendary_slugs
            calendary_ids = Calendary.by_slugs(calendary_slugs).unscope(:select).select(:id)
            self.where(calendary_id: calendary_ids)
         else
            self
         end
      end
   end
   has_many :calendaries, -> { distinct }, through: :memos
   scope :notice, -> { where(kind_code: NOTICE) }
   scope :usual, -> { where(kind_code: USUAL) }
   scope :calendaried, ->(calendary_slugs) { self.joins(:memos).where(memoes: { calendary_id: Calendary.by_slugs(calendary_slugs).unscope(:select).select(:id) }) }
   scope :memoed, -> { joins(:memos).merge(Memo.licit).distinct }
   scope :memoed_for, ->(calendary_slugs) { joins(:memos).calendaried(calendary_slugs).merge(Memo.licit).distinct }
   scope :by_token, -> text do
      left_outer_joins( :kind, :titles ).
         merge(Subject.by_token(text)).
         where("unaccent(events.kind_code) ~* unaccent(?)", "\\m#{text}.*").or(
         where(type_number: text.to_i).or(
         where("unaccent(descriptions.text) ~* unaccent(?)", "\\m#{text}.*").or(
         where("unaccent(names_subjects.text) ~* unaccent(?)", "\\m#{text}.*").or(
         where("unaccent(descriptions_subjects.text) ~* unaccent(?)", "\\m#{text}.*")))))
   end
   scope :by_event_code, -> code do
      if code =~ /^\d+$/
         where(id: code)
      else
         left_outer_joins(:kind_titles).where(kind_titles: { text: code })
      end
   end

   scope :by_memory_id, -> memory_id do
      where(memory_id: memory_id)
   end

   scope :by_title_and_short_name, -> title, short_name do
      joins(:memory).merge(Memory.by_short_name(short_name)).by_title(title)
   end
   scope :by_did_and_short_name, -> did, short_name do
      if /^[0-9]+$/ =~ did
         where(id: did)
      else
         by_title(did)
      end.joins(:memory).merge(Memory.by_short_name(short_name))
   end
   # required for short list
   scope :with_key, -> _ do
      selector = [ 'events.id AS _key' ]

      select(selector).group('_key').reorder("_key")
   end

   scope :with_value, -> context do
      language_codes = [ context[:locales] ].flatten
      alphabeth_codes = Languageble.alphabeth_list_for( language_codes ).flatten
      selector = self.select_values.dup

      /`(?<method_name>[^']*)'/ =~ caller.grep(/delegation/)[1]

      join = "LEFT OUTER JOIN subjects AS event_kinds_#{method_name}
                           ON event_kinds_#{method_name}.kind_code = 'EventKind'
                          AND event_kinds_#{method_name}.key = events.kind_code
              LEFT OUTER JOIN descriptions AS titles
                           ON titles.id IS NOT NULL
                          AND (titles.describable_id = events.id
                          AND titles.describable_type = 'Event'
                          AND titles.type = 'Title'
                           OR titles.describable_id = event_kinds_#{method_name}.id
                          AND titles.describable_type = 'Subject'
                          AND titles.type = 'Appellation')
                          AND titles.language_code IN ('#{language_codes.join("', '")}')
              LEFT OUTER JOIN subjects AS languages
                           ON languages.key = titles.language_code
              LEFT OUTER JOIN descriptions AS language_names
                           ON language_names.describable_id = languages.id
                          AND language_names.describable_type = 'Event'
                          AND language_names.language_code IN ('#{language_codes.join("', '")}')
              LEFT OUTER JOIN subjects AS alphabeths
                           ON alphabeths.key = titles.alphabeth_code
              LEFT OUTER JOIN descriptions AS alphabeth_names
                           ON alphabeth_names.describable_id = alphabeths.id
                          AND alphabeth_names.describable_type = 'Event'
                          AND alphabeth_names.alphabeth_code IN ('#{alphabeth_codes.join("', '")}')"

      selector << "titles.text || ' (' || events.happened_at || ')' AS _value"
      joins(join).select(selector).group(:id, "titles.text", "events.happened_at")
   end

   scope :with_memory, -> context do
      join_name = table.table_alias || table.name
      selector = self.select_values.dup << "#{join_name}.*" <<
         "COALESCE(jsonb_build_object(
            'slug', memory_slugs.text,
            'order', #{join_name}_memories.order,
            'short_name', #{join_name}_memories.short_name)) AS _memory"

      join = "LEFT OUTER JOIN memories AS #{join_name}_memories
                           ON #{join_name}_memories.id = #{join_name}.memory_id
              LEFT OUTER JOIN slugs AS memory_slugs
                           ON memory_slugs.sluggable_type = 'Memory'
                          AND memory_slugs.sluggable_id = #{join_name}.memory_id"

      joins(join, :memory).merge(Memory.with_names(context)).select(selector).group(:id, 'memory_slugs.text')
   end

   scope :with_icon, -> context do
      as = table.table_alias || table.name
      language_codes = [ context[:locales] ].flatten
      selector = self.select_values.dup
      selector << "#{as}.*" if selector.empty?
      selector << "COALESCE((WITH __picture AS (
                      SELECT #{as}_pictures.url AS url,
                             #{as}_pictures.width AS width,
                             #{as}_pictures.height AS height,
                             #{as}_image_attitudes.pos AS pos,
                             #{as}_titles.text AS title
                        FROM pictures AS #{as}_pictures
             LEFT OUTER JOIN image_attitudes AS #{as}_image_attitudes
                          ON #{as}_image_attitudes.imageable_id = #{as}.id
                         AND #{as}_image_attitudes.imageable_type = 'Event'
             LEFT OUTER JOIN descriptions AS #{as}_titles
                          ON #{as}_titles.describable_id = #{as}_pictures.id
                         AND #{as}_titles.describable_type = 'Picture'
                         AND #{as}_titles.type = 'Title'
                         AND #{as}_titles.language_code IN ('#{language_codes.join("', '")}')
                       WHERE #{as}_image_attitudes.picture_id = #{as}_pictures.id
                         AND #{as}_pictures.type = 'Icon'
                    ORDER BY random()
                       LIMIT 1)
                      SELECT jsonb_agg(__picture)
                        FROM __picture), '[]'::jsonb) AS _picture"

      select(selector).group(:id)
   end

   scope :with_place, -> context do
      language_codes = [ context[:locales] ].flatten
      selector = "jsonb_build_object('id', places.id, 'name', place_descriptions.text) AS _place"
      join = "LEFT OUTER JOIN places
                           ON events.place_id = places.id
                          AND places.id IS NOT NULL
              LEFT OUTER JOIN descriptions AS place_descriptions
                           ON place_descriptions.describable_id = places.id
                          AND place_descriptions.describable_type = 'Place'
                          AND place_descriptions.language_code IN ('#{language_codes.join("', '")}')"

      joins(join).select(selector).group(:id, 'places.id', 'place_descriptions.text')
   end

   scope :with_short_memoes, -> context do
      language_codes = [ context[:locales] ].flatten
      cslugs_rule = context[:calendary_slugs] ? "AND calendary_slugs.text IN ('#{context[:calendary_slugs].join("','")}')" : ""

      selector = "COALESCE((WITH __memoes AS (
                       SELECT DISTINCT ON(memoes.id)
                              memoes.id AS id,
                              memoes.year_date AS year_date,
                              jsonb_object_agg(DISTINCT COALESCE(memo_slugs.text, 'Null'),
                                                        order_titles_memoes.text) AS orders,
                              memo_titles.text AS title
                         FROM memoes
                         JOIN calendaries
                           ON calendaries.id = memoes.calendary_id
                         JOIN slugs AS calendary_slugs
                           ON calendary_slugs.sluggable_id = calendaries.id
                          AND calendary_slugs.sluggable_type = 'Calendary'
                          #{cslugs_rule}
              LEFT OUTER JOIN descriptions AS memo_titles
                           ON memo_titles.describable_id = memoes.id
                          AND memo_titles.describable_type = 'Memo'
                          AND memo_titles.type = 'Title'
                          AND memo_titles.language_code IN ('#{language_codes.join("', '")}')
              LEFT OUTER JOIN memo_orders
                           ON memo_orders.memo_id = memoes.id
              LEFT OUTER JOIN orders
                           ON orders.id = memo_orders.order_id
              LEFT OUTER JOIN slugs AS memo_slugs
                           ON memo_slugs.sluggable_id = orders.id
                          AND memo_slugs.sluggable_type = 'Order'
              LEFT OUTER JOIN memo_orders AS memo_orders_memoes_join
                           ON memo_orders_memoes_join.memo_id = memoes.id
              LEFT OUTER JOIN orders AS orders_memoes_join
                           ON orders_memoes_join.id = memo_orders_memoes_join.order_id
              LEFT OUTER JOIN descriptions AS order_titles_memoes
                           ON order_titles_memoes.describable_id = orders_memoes_join.id
                          AND order_titles_memoes.describable_type = 'Order'
                          AND order_titles_memoes.type IN ('Tweet')
                          AND order_titles_memoes.language_code IN ('#{language_codes.join("', '")}')
                        WHERE memoes.event_id = events.id
                          AND memoes.bond_to_id IS NULL
                          AND memoes.id IS NOT NULL
                     GROUP BY memoes.id, year_date, title)
                       SELECT jsonb_agg(__memoes)
                         FROM __memoes), '[]'::jsonb) AS _memoes"

      #binding.pry
      select(selector).group(:id)
   end

   scope :with_orders, -> context do
      language_codes = [ context[:locales] ].flatten
      cslugs_rule = context[:calendary_slugs] ? "AND calendary_slugs.text IN ('#{context[:calendary_slugs].join("','")}')" : ""
      as = table.table_alias || table.name

      selector = "COALESCE((WITH __orders AS (
                       SELECT DISTINCT ON(memo_slugs.text)
                              memo_slugs.text AS slug,
                              order_titles_memoes.text AS name
                         FROM orders
              LEFT OUTER JOIN memoes
                           ON #{as}.id = memoes.event_id
              LEFT OUTER JOIN calendaries
                           ON calendaries.id = memoes.calendary_id
              LEFT OUTER JOIN slugs AS calendary_slugs
                           ON calendary_slugs.sluggable_id = calendaries.id
                          AND calendary_slugs.sluggable_type = 'Calendary'
                              #{cslugs_rule}
              LEFT OUTER JOIN memo_orders
                           ON memo_orders.memo_id = memoes.id
              LEFT OUTER JOIN slugs AS memo_slugs
                           ON memo_slugs.sluggable_id = orders.id
                          AND memo_slugs.sluggable_type = 'Order'
              LEFT OUTER JOIN descriptions AS order_titles_memoes
                           ON order_titles_memoes.describable_id = orders.id
                          AND order_titles_memoes.describable_type = 'Order'
                          AND order_titles_memoes.type IN ('Tweet')
                          AND order_titles_memoes.language_code IN ('#{language_codes.join("', '")}')
                        WHERE orders.id = memo_orders.order_id
                          AND calendaries.licit = 't'
                     GROUP BY order_titles_memoes.text, memo_slugs.text)
                       SELECT jsonb_agg(__orders)
                         FROM __orders), '[]'::jsonb) AS _orders"

      #binding.pry
      select(selector).group(:id)
   end

   scope :with_memoes, -> context do
      language_codes = [ context[:locales] ].flatten
      cslugs_rule = context[:calendary_slugs] ? "AND calendary_slugs.text IN ('#{context[:calendary_slugs].join("','")}')" : ""

      selector = "COALESCE((WITH __memoes AS (
                       SELECT DISTINCT ON(memoes.id)
                              memoes.id AS id,
                              memoes.year_date AS year_date,
                              jsonb_object_agg(DISTINCT COALESCE(memo_slugs.text, 'Null'),
                                                        order_titles_memoes.text) AS orders,
                              memo_titles.text AS title,
                              memo_descriptions.text AS description,
                              memo_links.url AS url,
                              calendary_links.url AS calendary_url,
                              calendary_slugs.text AS calendary_slug,
                              calendary_titles.text AS calendary_title
                         FROM memoes
                         JOIN calendaries
                           ON calendaries.id = memoes.calendary_id
                         JOIN slugs AS calendary_slugs
                           ON calendary_slugs.sluggable_id = calendaries.id
                          AND calendary_slugs.sluggable_type = 'Calendary'
                          #{cslugs_rule}
              LEFT OUTER JOIN links AS calendary_links
                           ON calendary_links.info_id = calendaries.id
                          AND calendary_links.info_type = 'Calendary'
              LEFT OUTER JOIN descriptions AS memo_titles
                           ON memo_titles.describable_id = memoes.id
                          AND memo_titles.describable_type = 'Memo'
                          AND memo_titles.type = 'Title'
                          AND memo_titles.language_code IN ('#{language_codes.join("', '")}')
              LEFT OUTER JOIN descriptions AS memo_descriptions
                           ON memo_descriptions.describable_id = memoes.id
                          AND memo_descriptions.describable_type = 'Memo'
                          AND memo_descriptions.type = 'Description'
                          AND memo_descriptions.language_code IN ('#{language_codes.join("', '")}')
              LEFT OUTER JOIN links AS memo_links
                           ON memo_links.info_id = memoes.id
                          AND memo_links.info_type = 'Memo'
              LEFT OUTER JOIN descriptions AS calendary_titles
                           ON calendary_titles.describable_id = calendaries.id
                          AND calendary_titles.describable_type = 'Calendary'
                          AND calendary_titles.type = 'Appellation'
                          AND calendary_titles.language_code IN ('#{language_codes.join("', '")}')
              LEFT OUTER JOIN memo_orders
                           ON memo_orders.memo_id = memoes.id
              LEFT OUTER JOIN orders
                           ON orders.id = memo_orders.order_id
              LEFT OUTER JOIN slugs AS memo_slugs
                           ON memo_slugs.sluggable_id = orders.id
                          AND memo_slugs.sluggable_type = 'Order'
              LEFT OUTER JOIN memo_orders AS memo_orders_memoes_join
                           ON memo_orders_memoes_join.memo_id = memoes.id
              LEFT OUTER JOIN orders AS orders_memoes_join
                           ON orders_memoes_join.id = memo_orders_memoes_join.order_id
              LEFT OUTER JOIN descriptions AS order_titles_memoes
                           ON order_titles_memoes.describable_id = orders_memoes_join.id
                          AND order_titles_memoes.describable_type = 'Order'
                          AND order_titles_memoes.type IN ('Tweet')
                          AND order_titles_memoes.language_code IN ('#{language_codes.join("', '")}')
                        WHERE memoes.event_id = events.id
                          AND memoes.bond_to_id IS NULL
                          AND memoes.id IS NOT NULL
                          AND calendaries.licit = 't'
                     GROUP BY memoes.id, year_date, title, description, calendary_slug,
                              calendary_title, calendary_url, memo_links.url)
                       SELECT jsonb_agg(__memoes)
                         FROM __memoes), '[]'::jsonb) AS _memoes"

      #binding.pry
      select(selector).group(:id)
   end

   scope :with_scripta, -> context do
      language_codes = [ context[:locales] ].flatten
      selector = self.select_values.dup
      if selector.empty?
         selector << 'events.*'
      end
      selector << "COALESCE((SELECT jsonb_agg(scripta)
                               FROM scripta
                    LEFT OUTER JOIN services
                                 ON services.info_id = events.id
                                AND services.info_type = 'Event'
                    LEFT OUTER JOIN service_scripta
                                 ON service_scripta.service_id = services.id
                              WHERE scripta.id = service_scripta.scriptum_id
                                AND scripta.language_code IN ('#{language_codes.join("', '")}')), '[]'::jsonb) AS _scripta"

      select(selector).group(:id)
   end

   accepts_nested_attributes_for :place, reject_if: :all_blank
   accepts_nested_attributes_for :coordinate, reject_if: :all_blank
   accepts_nested_attributes_for :item, reject_if: :all_blank

   singleton_class.send(:alias_method, :t, :by_token)
   singleton_class.send(:alias_method, :mid, :by_memory_id)

   validates_presence_of :kind, :kind_code

   def self.year_date_for year_date, date_in, julian
      return nil if date_in.blank?

      date =  [ Time, Date, DateTime ].any? {|c| date_in.is_a?(c) } && date_in || Time.parse(date_in)
      if /(?<day>\d+)\.(?<month>\d+)%(?<weekday>\d+)$/ =~ year_date
         base_date = Date.parse("#{date.year}-#{month}-#{day}")
         base_offset = weekday.to_i - base_date.wday
         (base_date + (base_offset < 1 && (base_offset + 7) || base_offset)).strftime("%d.%m")
      elsif /(?<offset>[+-]\d+)/ =~ year_date
         gap = (julian && 13.days || 0)
         easter = WhenEaster::EasterCalendar.find_greek_easter_date(date.year) - gap
         (easter + offset.to_i.days).strftime("%d.%m")
      else
         year_date
      end
   end
end
