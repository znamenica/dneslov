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
   extend AsJson

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

   has_many :memos, dependent: :delete_all do
      def for calendary_slugs
         calendary_ids = Calendary.by_slugs(calendary_slugs).unscope(:select).select(:id)
         self.where(calendary_id: calendary_ids) ;end;end

   has_one :coordinate, as: :info, inverse_of: :info, class_name: :CoordLink
   has_many :calendaries, -> { distinct }, through: :memos
   has_many :titles, -> { title }, as: :describable, class_name: :Title do
      def by_default this
        self.or( Appellation.merge( this.kind.names ))
           .order( :describable_type ).distinct ;end;end

   has_many :default_titles, -> { distinct }, through: :kind, source: :names, class_name: :Appellation
   has_many :all_titles, ->(this) do
      where( describable_type: "Event", describable_id: this.id, kind: "Title" )
        .or( Appellation.merge(this.kind.names) )
     .order( :describable_type )
   end, primary_key: nil, class_name: :Description
   has_many :event_kinds, primary_key: :kind_code, foreign_key: :key, foreign_type: :kind_code, class_name: :Subject


   # synod : belongs_to
   # czin: has_one/many

   scope :notice, -> { where(kind_code: NOTICE) }
   scope :usual, -> { where(kind_code: USUAL) }
   scope :memoed, -> { joins( :memos ).distinct }
   scope :by_token, -> text do
      left_outer_joins( :kind, :titles ).
         merge(Subject.by_token(text)).
         where("events.kind_code ~* ?", "\\m#{text}.*").or(
         where(type_number: text.to_i).or(
         where("descriptions.text ~* ?", "\\m#{text}.*").or(
         where("names_subjects.text ~* ?", "\\m#{text}.*").or(
         where("descriptions_subjects.text ~* ?", "\\m#{text}.*"))))) ;end
   scope :by_memory_id, -> memory_id do
      where(memory_id: memory_id) ;end

   # required for short list
   scope :with_key, -> _ do
      selector = [ 'events.id AS _key' ]

      select(selector).group('_key').reorder("_key") ;end

   scope :with_value, -> context do
      language_codes = [ context[:locales] ].flatten
      alphabeth_codes = Languageble.alphabeth_list_for( language_codes ).flatten
      selector = self.select_values.dup

  #RssFeed
  #  .arel_table
  #  .join(RssFeedUser.arel_table, Arel::Nodes::OuterJoin)
  #  .on(RssFeed.arel_table[:id].eq(RssFeedUser.arel_table[:rss_feed_id]))
  #  .where(RssFeedUser.arel_table[:user_id].eq(nil))
  #  .project('rss_feeds.*')

      #car = Q.arel_table
     # self.join(Subject.arel_table, Arel::Nodes::OuterJoin)
      #    .as(:event_kinds)
      #    .on(Event.arel_table[:kind_code].eq(Subject.arel_table[:key]))
      #    .and(Subject.arel_table[:key].eq("EventKind"))
      #    .join(Description.arel_table, Arel::Nodes::OuterJoin)
      #    .as(:titles)
      #    .on(Description.arel_table[:id].not.eq(nil))
      #    .and(Subject.arel_table[:key].eq("EventKind"))

     # join = "LEFT OUTER JOIN subjects AS event_kinds
     #                      ON event_kinds.kind_code = 'EventKind'
     #                     AND event_kinds.key = events.kind_code
      join = "LEFT OUTER JOIN descriptions AS titles
                           ON titles.id IS NOT NULL
                          AND (titles.describable_id = events.id
                          AND titles.describable_type = 'Event'
                          AND titles.type = 'Title'
                           OR titles.describable_id = event_kinds.id
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
      #aa.as("event_kinds")[:kind_code]

      event_kinds = Subject.arel_table
      event_kinds.table_alias = "event_kinds"
      events = Event.arel_table
      # binding.pry
      #event_kinds = event_kinds_join.as("event_kinds")
      aa = event_kinds.join(event_kinds, Arel::Nodes::OuterJoin).on(events[:kind_code].eq(event_kinds[:key]).and(event_kinds[:key].eq("EventKind")))
      #binding.pry
      #includes(:event_kinds).references(:event_kinds).joins(join).select( selector ).group( :id, "titles.text", "events.happened_at" ) ;end
      #left_outer_joins(join).select( selector ).group( :id, "titles.text", "events.happened_at" ) ;end
      joins(aa.join_sources).joins(join).select( selector ).group( :id, "titles.text", "events.happened_at" ) ;end


   scope :with_description, -> context do
      language_codes = [ context[:locales] ].flatten
      alphabeth_codes = Languageble.alphabeth_list_for( language_codes ).flatten
      selector = self.select_values.dup
      if selector.empty?
         selector << 'events.*'
      end
      selector << 'descriptions.text AS _description'

      join = "LEFT OUTER JOIN descriptions ON descriptions.describable_id = events.id
                          AND descriptions.describable_type = 'Event'
                          AND descriptions.type = 'Description'
                          AND descriptions.language_code IN ('#{language_codes.join("', '")}')"

      joins(join).select(selector.uniq).group('_description', 'events.id') ;end

   scope :with_titles, -> context do
      language_codes = [ context[:locales] ].flatten
      alphabeth_codes = Languageble.alphabeth_list_for( language_codes ).flatten
      selector = self.select_values.dup
      if selector.empty?
         selector << "#{model.table_name}.*"
      end

      selector << "COALESCE((WITH __titles AS (
                      SELECT DISTINCT ON(titles.id)
                             titles.id AS id,
                             titles.describable_type AS type,
                             titles.text AS text,
                             titles.language_code AS language_code,
                             titles.alphabeth_code AS alphabeth_code,
                             language_names.text AS language,
                             alphabeth_names.text AS alphabeth
                        FROM descriptions AS titles
             LEFT OUTER JOIN subjects AS event_kinds
                          ON event_kinds.kind_code = 'EventKind'
                         AND event_kinds.key = events.kind_code
             LEFT OUTER JOIN subjects AS languages
                          ON languages.key = titles.language_code
             LEFT OUTER JOIN descriptions AS language_names
                          ON language_names.describable_id = languages.id
                         AND language_names.describable_type = 'Subject'
                         AND language_names.language_code IN ('#{language_codes.join("', '")}')
             LEFT OUTER JOIN subjects AS alphabeths
                          ON alphabeths.key = titles.alphabeth_code
             LEFT OUTER JOIN descriptions AS alphabeth_names
                          ON alphabeth_names.describable_id = alphabeths.id
                         AND alphabeth_names.describable_type = 'Subject'
                         AND alphabeth_names.alphabeth_code IN ('#{alphabeth_codes.join("', '")}')
                       WHERE titles.id IS NOT NULL
                         AND (titles.describable_id = events.id
                         AND titles.describable_type = 'Event'
                         AND titles.type = 'Title'
                          OR titles.describable_id = event_kinds.id
                         AND titles.describable_type = 'Subject'
                         AND titles.type = 'Appellation')
                         AND titles.language_code IN ('#{language_codes.join("', '")}')
                    GROUP BY titles.id, titles.describable_type, titles.text,
                             language_names.text, alphabeth_names.text)
                      SELECT jsonb_agg(__titles)
                        FROM __titles), '[]'::jsonb) AS _titles"

      # binding.pry
      select( selector ).group( :id ) ;end

   scope :with_descriptions, -> context do
      language_codes = [ context[:locales] ].flatten
      alphabeth_codes = Languageble.alphabeth_list_for( language_codes ).flatten
      selector = self.select_values.dup
      if self.select_values.dup.empty?
         selector << "#{model.table_name}.*"
      end

      selector << "COALESCE((with __descriptions AS (
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
             LEFT OUTER JOIN descriptions AS language_names
                          ON language_names.describable_id = languages.id
                         AND language_names.describable_type = 'Subject'
                         AND language_names.language_code IN ('#{language_codes.join("', '")}')
             LEFT OUTER JOIN subjects AS alphabeths
                          ON alphabeths.key = descriptions.alphabeth_code
             LEFT OUTER JOIN descriptions AS alphabeth_names
                          ON alphabeth_names.describable_id = alphabeths.id
                         AND alphabeth_names.describable_type = 'Subject'
                         AND alphabeth_names.alphabeth_code IN ('#{alphabeth_codes.join("', '")}')
                       WHERE descriptions.describable_id = #{model.table_name}.id
                         AND descriptions.describable_type = '#{model}'
                         AND descriptions.type IN ('Description', 'Appellation')
                    GROUP BY descriptions.id, language_names.text, alphabeth_names.text)
                      SELECT jsonb_agg(__descriptions)
                        FROM __descriptions), '[]'::jsonb) AS _descriptions"

      select( selector ).group( :id ) ;end

   scope :with_place, -> language_code do
      language_codes = [ language_code ].flatten
      selector = "jsonb_build_object('id', places.id, 'name', place_descriptions.text) AS _place"
      join = "LEFT OUTER JOIN places
                           ON events.place_id = places.id
                          AND places.id IS NOT NULL
              LEFT OUTER JOIN descriptions AS place_descriptions
                           ON place_descriptions.describable_id = places.id
                          AND place_descriptions.describable_type = 'Place'
                          AND place_descriptions.language_code IN ('#{language_codes.join("', '")}')"

      joins(join).select(selector).group(:id, 'places.id', 'place_descriptions.text') ;end

   scope :with_memoes, -> (language_code) do
      language_codes = [ language_code ].flatten
      selector = "COALESCE((WITH __memoes AS (
                       SELECT memoes.id AS id,
                              memoes.year_date AS year_date,
                              jsonb_object_agg(DISTINCT memo_slugs.text,
                                                        order_titles_memoes.text) AS orders,
                              memo_titles.text AS title,
                              memo_descriptions.text AS description,
                              memo_links.url AS url,
                              calendary_links.url AS calendary_url,
                              calendary_slugs.text AS calendary_slug,
                              calendary_titles.text AS calendary_title
                         FROM memoes
              LEFT OUTER JOIN slugs AS calendary_slugs
                           ON calendary_slugs.sluggable_id = memoes.calendary_id
                          AND calendary_slugs.sluggable_type = 'Calendary'
              LEFT OUTER JOIN links AS calendary_links
                           ON calendary_links.info_id = memoes.id
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
                           ON calendary_titles.describable_id = memoes.calendary_id
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
                     GROUP BY memoes.id, year_date, title, description, calendary_slug,
                              calendary_title, calendary_url, memo_links.url)
                       SELECT jsonb_agg(__memoes)
                         FROM __memoes), '[]'::jsonb) AS _memoes"

      #binding.pry
      select(selector).group(:id) ;end

   scope :with_cantoes, -> (language_code) do
      language_codes = [ language_code ].flatten
      selector = self.select_values.dup
      if selector.empty?
         selector << 'events.*'
      end
      selector << "COALESCE((SELECT jsonb_agg(cantoes)
                               FROM cantoes
                    LEFT OUTER JOIN services
                                 ON services.info_id = events.id
                                AND services.info_type = 'Event'
                    LEFT OUTER JOIN service_cantoes
                                 ON service_cantoes.service_id = services.id
                              WHERE cantoes.id = service_cantoes.canto_id
                                AND cantoes.language_code IN ('#{language_codes.join("', '")}')), '[]'::jsonb) AS _cantoes"

      select(selector).group(:id)
   end

   accepts_nested_attributes_for :place, reject_if: :all_blank
   accepts_nested_attributes_for :coordinate, reject_if: :all_blank
   accepts_nested_attributes_for :item, reject_if: :all_blank
   accepts_nested_attributes_for :titles, reject_if: :all_blank, allow_destroy: true

   singleton_class.send(:alias_method, :t, :by_token)
   singleton_class.send(:alias_method, :mid, :by_memory_id)

   validates_presence_of :kind, :kind_code

   ATTRS = {
      created_at: nil,
      updated_at: nil,
   }

   def as_json options = {}
      attrs = ATTRS.merge(self.instance_variable_get(:@attributes).send(:attributes).send(:additional_types))
      original = super(options.merge(except: attrs.keys))

      attrs.reduce(original) do |r, (name, rule)|
         if /^_(?<realname>.*)/ =~ name
            r.merge(realname => read_attribute(name).as_json)
         elsif rule.is_a?(Proc)
            r.merge(name => rule[self])
         else
            r
         end
      end
   end

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
