# council[string]       - соборы для памяти
# short_name[string]    - краткое имя
# quantity[string]      - количество
#
class Memory < ActiveRecord::Base
   extend TotalSize
   extend DefaultKey
   extend Informatible
   include WithTitles
   include WithDescriptions
   include WithLinks

   has_default_key :short_name

   has_one :slug, as: :sluggable, dependent: :destroy
   has_many :memory_names, dependent: :destroy
   has_many :nomina, through: :memory_names
   has_many :names, through: :nomina
   has_many :paterics, as: :info, dependent: :destroy, class_name: :PatericLink
   has_many :events, dependent: :destroy
   has_many :memos, through: :events
   has_many :service_scripta, through: :services
   has_many :scripta, through: :service_scripta
   has_many :calendaries, -> { distinct.reorder('id') }, through: :memos
   has_many :thumbs, -> { where(thumbs: { thumbable_type: "Memory" }) }, foreign_key: :thumbable_id, dependent: :destroy
   has_many :attitudes, as: :imageable, class_name: :ImageAttitude
   has_many :pictures, through: :attitudes
   has_many :notes, as: :describable, dependent: :destroy, class_name: :Note
   has_many :orders, -> { distinct.reorder('id') }, through: :memos, source: :orders
   has_many :slugs, -> { distinct.reorder('id') }, through: :orders, source: :slug
   has_many :memory_binds
   has_many :bond_memories, through: :memory_binds, foreign_key: :bond_to_id, class_name: :Memory
   has_many :coverings
   has_many :places, through: :coverings

   default_scope { order( base_year: :asc, short_name: :asc, id: :asc ) }

   scope :icons, -> { joins( :slugs ).where( slugs: { text: :обр } ) }

   scope :by_short_name, -> name { where( short_name: name ) }
   scope :by_slug, -> slug do
      unscoped.joins(:slug).where(slugs: {text: slug.split(",")})
   end

   scope :in_calendaries, -> calendaries_in do
      calendaries = calendaries_in.is_a?(String) && calendaries_in.split(',') || calendaries_in
      left_outer_joins( :memos ).merge( Memo.in_calendaries( calendaries )).distinct
   end

   scope :by_date, -> (date, julian = false) do
      left_outer_joins(:memos).merge(Memo.by_date(date, julian)).distinct
   end

   scope :by_token, -> text do
      left_outer_joins(:names, :descriptions).where( "short_name ~* ?", "\\m#{text}.*" ).or(
         where("unaccent(descriptions.text) ~* unaccent(?) OR unaccent(names.text) ~* unaccent(?)", "\\m#{text}.*", "\\m#{text}.*")).or(merge(
         Nomen.joins(:name).where("unaccent(names.text) ~* unaccent(?)", "\\m#{text}.*").by_root)).distinct
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

   # required for short list
   scope :with_key, -> _ do
      selector = [ 'memories.id AS _key' ]

      select(selector).group('_key').reorder("_key")
   end

   scope :with_value, -> context do
      #TODO add search over names
      selector = [ 'memories.short_name AS _value' ]

      select(selector).group('_value').reorder("_value")
   end

   scope :with_names, -> (context) do
      language_codes = [context[:locales]].flatten
=begin
with recursive t(level,path,id,name_id,bind_kind_name,bond_to_id,root_id,name_alphabeth_code,name_language_code,name_text,state_code,mode,feasible) as (
        with recursive tt(level,path,id,name_id,bind_kind_name,bond_to_id,root_id,name_alphabeth_code,name_language_code,name_text,state_code,mode,feasible) as (SELECT 0,nm.text,n.id,n.name_id,n.bind_kind_name,n.bond_to_id,n.root_id,nm.alphabeth_code,nm.language_code,nm.text,mn.state_code,mn.mode,mn.feasible FROM nomina n JOIN names nm ON nm.id = n.name_id JOIN memory_names mn ON mn.nomen_id = n.id WHERE  mn.memory_id = 2989 UNION SELECT level + 1, path || ' > ' || nm.text, n.id,n.name_id,n.bind_kind_name,n.bond_to_id,n.root_id,nm.alphabeth_code,nm.language_code,nm.text,tt.state_code,tt.mode,tt.feasible FROM nomina n JOIN tt ON n.root_id = tt.root_id AND  tt.bond_to_id = n.name_id JOIN names nm ON nm.id = n.name_id JOIN names nm_t ON nm_t.id = tt.name_id AND nm_t.language_code <> nm.language_code LEFT OUTER JOIN memory_names mn ON n.root_id = mn.nomen_id AND mn.memory_id = 2989 ) select * from tt
    UNION
        SELECT DISTINCT
            level + 1,
            path || ' > ' || nm.text,
            n.id,n.name_id,n.bind_kind_name,n.bond_to_id,n.root_id,nm.alphabeth_code,nm.language_code,nm.text,t.state_code,t.mode,t.feasible
        FROM
            nomina n JOIN t
                ON n.bond_to_id = t.name_id AND n.root_id = t.root_id JOIN names nm ON nm.id = n.name_id JOIN names nm_t ON nm_t.id = t.name_id AND nm_t.language_code <> nm.language_code LEFT OUTER JOIN memory_names mn ON n.root_id = mn.nomen_id AND mn.memory_id = 2989
) select * from t  WHERE name_language_code IN ('ру')
=end

      selector = "COALESCE((
              WITH RECURSIVE __names(level,path,id,name_id,name_bind_kind_name,bond_to_id,root_id,name_alphabeth_code,name_language_code,name_text,state_code,mode,feasible) AS (
              WITH RECURSIVE tt(level,path,id,name_id,bind_kind_name,bond_to_id,root_id,name_alphabeth_code,name_language_code,name_text,state_code,mode,feasible) AS (
                      SELECT 0,
                             nm.text,
                             n.id,
                             n.name_id,
                             n.bind_kind_name,
                             n.bond_to_id,
                             n.root_id,
                             nm.alphabeth_code,
                             nm.language_code,
                             nm.text,
                             mn.state_code,
                             mn.mode,
                             mn.feasible
                        FROM nomina n
                        JOIN names nm
                          ON nm.id = n.name_id
                        JOIN memory_names mn
                          ON mn.nomen_id = n.id
                         AND mn.memory_id = memories.id
                       UNION

                      SELECT 0,
                             nm.text,
                             n.id,
                             n.name_id,
                             n.bind_kind_name,
                             n.bond_to_id,
                             n.root_id,
                             nm.alphabeth_code,
                             nm.language_code,
                             nm.text,
                             tt.state_code,
                             tt.mode,
                             tt.feasible
                        FROM nomina n
                        JOIN tt
                          ON n.root_id = tt.root_id AND tt.bond_to_id = n.name_id
                        JOIN names nm
                          ON nm.id = n.name_id
                        JOIN names nm_t
                          ON nm_t.id = tt.name_id
                         AND nm_t.language_code <> nm.language_code
             LEFT OUTER JOIN memory_names mn
                          ON n.root_id = mn.nomen_id
                         AND mn.memory_id = memories.id)
                      SELECT *
                        FROM tt

                       UNION
                      SELECT level + 1,
                             path || ' > ' || nm.text,
                             n.id,
                             n.name_id,
                             n.bind_kind_name,
                             n.bond_to_id,
                             n.root_id,
                             nm.alphabeth_code,
                             nm.language_code,
                             nm.text,
                             t.state_code,
                             t.mode,
                             t.feasible
                        FROM nomina n
                        JOIN __names t
                          ON n.bond_to_id = t.name_id
                         AND n.root_id = t.root_id
                        JOIN names nm
                          ON nm.id = n.name_id
                        JOIN names nm_t
                          ON nm_t.id = t.name_id
                         AND nm_t.language_code <> nm.language_code
             LEFT OUTER JOIN memory_names mn
                          ON n.root_id = mn.nomen_id
                         AND mn.memory_id = memories.id)
                      SELECT jsonb_agg(__names)
                        FROM __names
                       WHERE __names.name_language_code IN ('#{language_codes.join("', '")}')), '[]'::jsonb) AS _names"

      select(selector).group(:id)
   end

   scope :with_scripta, -> (context) do
      as = table.table_alias || table.name
      language_codes = [context[:locales]].flatten
      alphabeth_codes = context[:codes] || Languageble.alphabeth_list_for(language_codes).flatten
      calendaries_join =
         if context[:calendary_slugs]
             "JOIN calendaries AS #{as}_calendaries
                ON #{as}_calendaries.id = #{as}_memoes.calendary_id
              JOIN slugs AS #{as}_calendary_slugs
                ON #{as}_calendary_slugs.id = #{as}_calendaries.id
               AND #{as}_calendary_slugs.sluggable_type = 'Calendary'
               AND #{as}_calendary_slugs.text IN ('#{context[:calendary_slugs].join("','")}')"
         end

      selector = self.select_values.dup
      selector << "#{as}.*" if selector.empty?
      selector << "COALESCE((SELECT jsonb_agg(DISTINCT scripta)
                               FROM scripta
                               JOIN events
                                 ON memories.id = events.memory_id
                               JOIN memoes AS #{as}_memoes
                                 ON events.id = #{as}_memoes.event_id
                               JOIN memo_scripta
                                 ON memo_scripta.memo_id = #{as}_memoes.id
                                    #{calendaries_join}
                              WHERE scripta.id = memo_scripta.scriptum_id
                                AND scripta.language_code IN ('#{language_codes.join("', '")}')
                                AND scripta.alphabeth_code IN ('#{alphabeth_codes.join("', '")}')), '[]'::jsonb) AS _scripta"

      select(selector).group(:id)
   end

   scope :with_memory_binds, -> do
      as = table.table_alias || table.name

      selector = self.select_values.dup
      selector << "#{as}.*" if selector.empty?
      selector << "COALESCE((WITH __memory_binds AS (
                       SELECT #{as}_memory_binds.id AS id,
                              #{as}_memory_binds.bond_to_id AS bond_to_id,
                              #{as}_memory_binds.kind AS kind,
                              #{as}_bond_memories.short_name AS bond_to_name
                         FROM memory_binds AS #{as}_memory_binds
                         JOIN memories AS #{as}_bond_memories
                           ON #{as}_bond_memories.id = #{as}_memory_binds.bond_to_id
                        WHERE #{as}.id = #{as}_memory_binds.memory_id)
                       SELECT jsonb_agg(__memory_binds)
                         FROM __memory_binds), '[]'::jsonb) AS _memory_binds"

      select(selector).group(:id)
   end

   scope :with_covering_names, -> context do
      as = table.table_alias || table.name
      language_codes = [ context[:locales] ].flatten

      selector = self.select_values.dup
      selector << "#{as}.*" if selector.empty?
      selector << "COALESCE((WITH __coverings AS (
                       SELECT #{as}_coverings.id AS id,
                              #{as}_coverings.add_date AS add_date,
                              #{as}_coverings.place_id AS place_id,
                              #{as}_place_descriptions.text || ' (' || #{as}_place_descriptions.language_code || '_' || #{as}_place_descriptions.alphabeth_code || ')' AS place_name
                         FROM coverings AS #{as}_coverings
                         JOIN places AS #{as}_places
                           ON #{as}_places.id = #{as}_coverings.place_id
              LEFT OUTER JOIN descriptions AS #{as}_place_descriptions
                           ON #{as}_place_descriptions.describable_id = #{as}_places.id
                          AND #{as}_place_descriptions.describable_type = 'Place'
                          AND #{as}_place_descriptions.language_code IN ('#{language_codes.join("', '")}')
                        WHERE #{as}.id = #{as}_coverings.memory_id)
                       SELECT jsonb_agg(__coverings)
                         FROM __coverings), '[]'::jsonb) AS _coverings"

      select(selector).group(:id)
   end

   scope :with_coverings, -> context do
      as = table.table_alias || table.name
      language_codes = [ context[:locales] ].flatten

      selector = self.select_values.dup
      selector << "#{as}.*" if selector.empty?
      selector << "COALESCE((WITH __coverings AS (
                       SELECT #{as}_coverings.id AS id,
                              #{as}_coverings.add_date AS add_date,
                              #{as}_coverings.place_id AS place_id,
                              #{as}_place_descriptions.text AS name
                         FROM coverings AS #{as}_coverings
                         JOIN places AS #{as}_places
                           ON #{as}_places.id = #{as}_coverings.place_id
              LEFT OUTER JOIN descriptions AS #{as}_place_descriptions
                           ON #{as}_place_descriptions.describable_id = #{as}_places.id
                          AND #{as}_place_descriptions.describable_type = 'Place'
                          AND #{as}_place_descriptions.language_code IN ('#{language_codes.join("', '")}')
                        WHERE #{as}.id = #{as}_coverings.memory_id)
                       SELECT jsonb_agg(__coverings)
                         FROM __coverings), '[]'::jsonb) AS _coverings"

      select(selector).group(:id)
   end

   scope :with_memoes, -> context do
      as = table.table_alias || table.name
      language_codes = [ context[:locales] ].flatten
      cslugs_rule = context[:calendary_slugs] ? "AND calendary_slugs.text IN ('#{context[:calendary_slugs].join("','")}')" : ""

      selector = "COALESCE((WITH __memoes AS (
                       SELECT DISTINCT ON(memoes.id)
                              memoes.id AS id,
                              memoes.year_date AS year_date,
                              events.kind_code AS kind_code,
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
              LEFT OUTER JOIN events
                           ON memoes.event_id = events.id
                          AND events.kind_code IN ('#{Event::NOTICE.join("','")}')
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
                        WHERE events.memory_id = #{as}.id
                          AND memoes.bond_to_id IS NULL
                          AND memoes.id IS NOT NULL
                          AND calendaries.licit = 't'
                     GROUP BY memoes.id, year_date, title, description, calendary_slug,
                              calendary_title, calendary_url, memo_links.url, events.kind_code)
                       SELECT jsonb_agg(__memoes)
                         FROM __memoes), '[]'::jsonb) AS _memoes"

      select(selector).group(:id)
   end

   scope :with_bond_memories, ->(context) do
      as = table.table_alias || table.name
      language_codes = [context[:locales]].flatten
      alphabeth_codes = Languageble.alphabeth_list_for( language_codes ).flatten

      selector = self.select_values.dup
      selector << "#{as}.*" if selector.empty?
      selector << "COALESCE((WITH __bond_memories AS (
                      SELECT #{as}_memory_binds.id AS id,
                             #{as}_memory_binds.kind AS kind,
                             #{as}_memory_slugs.text AS slug,
                             COALESCE(#{as}_bond_memo_titles.text, #{as}_bond_memories.short_name) AS name
                        FROM memories AS #{as}_bond_memories
             LEFT OUTER JOIN slugs AS #{as}_memory_slugs
                          ON 'Memory' = #{as}_memory_slugs.sluggable_type
                         AND #{as}_bond_memories.id = #{as}_memory_slugs.sluggable_id
             LEFT OUTER JOIN memory_binds AS #{as}_memory_binds
                          ON #{as}_bond_memories.id = #{as}_memory_binds.bond_to_id
             LEFT OUTER JOIN events AS #{as}_events
                          ON #{as}.id = #{as}_events.memory_id
             LEFT OUTER JOIN memoes AS #{as}_memoes
                          ON #{as}_memoes.event_id = #{as}_events.id
             LEFT OUTER JOIN descriptions AS #{as}_bond_memo_titles
                          ON #{as}_bond_memo_titles.describable_id = #{as}_memoes.id
                         AND #{as}_bond_memo_titles.describable_type = 'Memo'
                         AND #{as}_bond_memo_titles.type = 'Name'
                         AND #{as}_bond_memo_titles.language_code IN ('#{language_codes.join("', '")}')
                         AND #{as}_bond_memo_titles.alphabeth_code IN ('#{alphabeth_codes.join("', '")}')
                       WHERE #{as}_memory_binds.memory_id = #{as}.id)
                      SELECT jsonb_agg(__bond_memories)
                        FROM __bond_memories), '[]'::jsonb) AS _bond_memories"

      select(selector).group(:id)
   end

   # https://efim360.ru/postgresql-tablicza-prisutstvuet-v-zaprose-no-soslatsya-na-neyo-iz-etoj-chasti-zaprosa-nelzya/?ysclid=lqs5tozisb568391387
   scope :with_icon, -> context do
      as = table.table_alias || table.name
      language_codes = [ context[:locales] ].flatten
      selector = self.select_values.dup
      selector << "#{as}.*" if selector.empty?
      selector << "jsonb_build_object(
         'url', #{as}_pictures.url,
         'thumb_url', #{as}_pictures.thumb_url,
         'width', #{as}_pictures.width,
         'height,', #{as}_pictures.height,
         'pos', #{as}_pictures.pos,
         'description', #{as}_pictures.description,
         'title', #{as}_pictures.title) AS _picture"
      join = "LEFT OUTER JOIN LATERAL (
                      SELECT #{as}_pictures.url AS url,
                             #{as}_pictures.thumb_url AS thumb_url,
                             #{as}_pictures.width AS width,
                             #{as}_pictures.height AS height,
                             #{as}_image_attitudes.pos::text AS pos,
                             #{as}_image_attitudes.imageable_id AS imageable_id,
                             #{as}_image_attitudes.imageable_type AS imageable_type,
                             #{as}_titles.text AS title,
                             #{as}_descriptions.text AS description
                        FROM pictures AS #{as}_pictures
             LEFT OUTER JOIN image_attitudes AS #{as}_image_attitudes
                          ON #{as}_image_attitudes.imageable_id = #{as}.id
                         AND #{as}_image_attitudes.imageable_type = 'Memory'
             LEFT OUTER JOIN descriptions AS #{as}_descriptions
                          ON #{as}_descriptions.describable_id = #{as}_pictures.id
                         AND #{as}_descriptions.describable_type = 'Picture'
                         AND #{as}_descriptions.type = 'Description'
                         AND #{as}_descriptions.language_code IN ('#{language_codes.join("', '")}')
             LEFT OUTER JOIN descriptions AS #{as}_titles
                          ON #{as}_titles.describable_id = #{as}_pictures.id
                         AND #{as}_titles.describable_type = 'Picture'
                         AND #{as}_titles.type = 'Title'
                         AND #{as}_titles.language_code IN ('#{language_codes.join("', '")}')
                       WHERE #{as}_image_attitudes.picture_id = #{as}_pictures.id
                         AND #{as}_pictures.type = 'Icon'
                    ORDER BY random()
                       LIMIT 1) AS #{as}_pictures
                          ON #{as}_pictures.imageable_id = #{as}.id
                         AND #{as}_pictures.imageable_type = 'Memory'"

      joins(join).select(selector).group(:id, "#{as}_pictures.url", "#{as}_pictures.thumb_url", "#{as}_pictures.width",
         "#{as}_pictures.height", "#{as}_pictures.pos", "#{as}_pictures.title", "#{as}_pictures.description")
   end

   scope :with_slug_text, -> do
      selector = self.select_values.dup
      if selector.empty?
         selector << 'memories.*'
      end
      selector << 'slugs.text AS _slug'

      left_outer_joins(:slug).select(selector.uniq).group('_slug').order('_slug')
   end

   scope :with_slug, -> do
      selector = self.select_values.dup
      if self.select_values.dup.empty?
         selector << 'memories.*'
      end

      selector << "jsonb_build_object('id', slugs.id, 'text', slugs.text) AS _slug"
      join = "LEFT OUTER JOIN slugs
                           ON slugs.sluggable_id = memories.id
                          AND slugs.sluggable_type = 'Memory'"

      joins(join).select(selector).group(:id, 'slugs.id', 'slugs.text')
   end

   scope :with_orders, -> context do
      language_codes = [ context[:locales] ].flatten
      selector = self.select_values.dup
      if self.select_values.dup.empty?
         selector << 'memories.*'
      end

      selector << "COALESCE((WITH __orders AS (
                       SELECT DISTINCT ON(orders.id)
                              orders.id AS id,
                              order_names.text AS name
                         FROM orders
                         JOIN memo_orders
                           ON memo_orders.order_id = orders.id
                         JOIN memoes
                           ON memoes.id = memo_orders.memo_id
                         JOIN events
                           ON events.id = event_id
              LEFT OUTER JOIN descriptions AS order_names
                           ON order_names.describable_id = orders.id
                          AND order_names.describable_type = 'Order'
                          AND order_names.language_code IN ('#{language_codes.join("', '")}')
                        WHERE events.memory_id = memories.id
                     GROUP BY orders.id, order_names.text)
                       SELECT jsonb_agg(__orders)
                         FROM __orders), '[]'::jsonb) AS _orders"

      select(selector).group(:id)
   end

   scope :with_events, -> context do
      as = table.table_alias || table.name
      language_codes = [context[:locales]].flatten
      alphabeth_codes = Languageble.alphabeth_list_for( language_codes ).flatten
      selector = self.select_values.dup
      if self.select_values.dup.empty?
         selector << 'memories.*'
      end

      selector << "COALESCE((WITH __events AS (
                      SELECT DISTINCT ON(events.id)
                             events.id AS id,
                             events.happened_at AS happened_at,
                             events.kind_code AS kind_code,
                             event_kind_titles.text AS kind_name,
                             events.place_id AS place_id,
                             place_names.text AS place,
                             events.item_id AS item_id,
                             COALESCE(item_names.text, #{as}_item_type_names.text) AS item,
                             events.person_name AS person_name,
                             events.type_number AS type_number,
                             events.about_string AS about_string,
                             events.tezo_string AS tezo_string,
                             events.order AS order,
                             events.council AS council,
              COALESCE((WITH __titles AS (
                      SELECT DISTINCT ON(titles.id)
                             titles.id AS id,
                             titles.text AS text,
                             titles.language_code AS language_code,
                             language_names.text AS language,
                             titles.alphabeth_code AS alphabeth_code,
                             alphabeth_names.text AS alphabeth
                        FROM descriptions AS titles
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
                       WHERE titles.describable_id = events.id
                         AND titles.describable_type = 'Event'
                         AND titles.language_code IN ('#{language_codes.join("', '")}')
                         AND titles.type = 'Title'
                    GROUP BY titles.id, language_names.text, alphabeth_names.text)
                      SELECT jsonb_agg(__titles)
                        FROM __titles), '[]'::jsonb) AS titles,
              COALESCE((WITH __descriptions AS (
                      SELECT DISTINCT ON(descriptions.id)
                             descriptions.id AS id,
                             descriptions.text AS text,
                             descriptions.language_code AS language_code,
                             language_names.text AS language,
                             descriptions.alphabeth_code AS alphabeth_code,
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
                       WHERE descriptions.describable_id = events.id
                         AND descriptions.describable_type = 'Event'
                         AND descriptions.language_code IN ('#{language_codes.join("', '")}')
                         AND descriptions.type IN ('Description')
                    GROUP BY descriptions.id, language_names.text, alphabeth_names.text)
                      SELECT jsonb_agg(__descriptions)
                        FROM __descriptions), '[]'::jsonb) AS descriptions
                        FROM events
             LEFT OUTER JOIN descriptions AS place_names
                          ON place_names.describable_id = events.place_id
                         AND place_names.describable_type = 'Place'
                         AND place_names.language_code IN ('#{language_codes.join("', '")}')
             LEFT OUTER JOIN items AS #{as}_items
                          ON #{as}_items.id = events.item_id
             LEFT OUTER JOIN descriptions AS item_names
                          ON item_names.describable_id = #{as}_items.id
                         AND item_names.describable_type = 'Item'
                         AND item_names.language_code IN ('#{language_codes.join("', '")}')
             LEFT OUTER JOIN descriptions AS #{as}_item_type_names
                          ON #{as}_item_type_names.describable_id = #{as}_items.item_type_id
                         AND #{as}_item_type_names.describable_type = 'ItemType'
                         AND #{as}_item_type_names.language_code IN ('#{language_codes.join("', '")}')
             LEFT OUTER JOIN subjects AS event_kinds
                          ON event_kinds.kind_code = 'EventKind'
                         AND event_kinds.key = events.kind_code
             LEFT OUTER JOIN descriptions AS event_kind_titles
                          ON event_kind_titles.describable_id = event_kinds.id
                         AND event_kind_titles.describable_type = 'Subject'
                         AND event_kind_titles.type = 'Appellation'
                         AND event_kind_titles.language_code IN ('#{language_codes.join("', '")}')
                       WHERE events.memory_id = memories.id
                    GROUP BY events.id, place_names.text, item_names.text, #{as}_item_type_names.text, event_kind_titles.text)
                      SELECT jsonb_agg(__events)
                        FROM __events), '[]'::jsonb) AS _events"

      select(selector).group(:id)
   end

   scope :with_memory_names, -> context do
      language_codes = [ context[:locales] ].flatten
      selector = self.select_values.dup
      if self.select_values.dup.empty?
         selector << 'memories.*'
      end

      selector = "COALESCE((
                        WITH __memory_names AS (
                      SELECT memory_names.id AS id,
                             nomina.id AS nomen_id,
                             names.text || COALESCE(' < ' || bond_toes.text, '') || ' (' || names.language_code|| '_' || names.alphabeth_code || ')' AS name,
                             memory_names.state_code AS state_code,
                             memory_name_state_titles.text AS state_name,
                             memory_names.mode AS mode,
                             memory_names.feasible AS feasible
                        FROM memory_names
             LEFT OUTER JOIN subjects AS memory_name_states
                          ON memory_name_states.key = memory_names.state_code
             LEFT OUTER JOIN descriptions AS memory_name_state_titles
                          ON memory_name_state_titles.describable_id = memory_name_states.id
                         AND memory_name_state_titles.describable_type = 'Subject'
                         AND memory_name_state_titles.language_code IN ('#{language_codes.join("', '")}')
             LEFT OUTER JOIN nomina
                          ON nomina.id = memory_names.nomen_id
             LEFT OUTER JOIN names
                          ON names.id = nomina.name_id
             LEFT OUTER JOIN names AS bond_toes
                          ON bond_toes.id = nomina.bond_to_id
                       WHERE memory_names.memory_id = memories.id
                         AND memory_names.id IS NOT NULL
                    GROUP BY memory_names.id, names.text, bond_toes.text, memory_name_state_titles.text, names.language_code, names.alphabeth_code, nomina.id)
                      SELECT jsonb_agg(__memory_names)
                        FROM __memory_names), '[]'::jsonb) AS _memory_names"

      select(selector).group(:id)
   end

   singleton_class.send(:alias_method, :t, :by_token)
   singleton_class.send(:alias_method, :q, :by_tokens)
   singleton_class.send(:alias_method, :d, :by_date)
   singleton_class.send(:alias_method, :c, :in_calendaries)

   accepts_nested_attributes_for :memory_binds, reject_if: :all_blank, allow_destroy: true
   accepts_nested_attributes_for :memory_names, reject_if: :all_blank, allow_destroy: true
   accepts_nested_attributes_for :paterics, reject_if: :all_blank, allow_destroy: true
   accepts_nested_attributes_for :events, reject_if: :all_blank, allow_destroy: true
   accepts_nested_attributes_for :memos, reject_if: :all_blank, allow_destroy: true
   accepts_nested_attributes_for :coverings, reject_if: :all_blank, allow_destroy: true
   accepts_nested_attributes_for :notes, reject_if: :all_blank, allow_destroy: true
   accepts_nested_attributes_for :slug, reject_if: :all_blank

   validates_presence_of :short_name, :events
   validates :base_year, format: { with: /\A-?\d+\z/ }
   validates :quantity, format: { with: /\A[0-9?+]+?\z/ }, allow_blank: true

   before_create :set_slug
   before_validation :set_base_year, on: :create

   def set_base_year
      types = %w(Resurrection Repose Writing Appearance Translation Sanctification)

      event = self.events.to_a.sort_by { |x| (types.index(x.kind) || 100) }.first

      return unless event

      dates = event.happened_at.split(/[\/-]/)
      self.base_year ||=
         case dates.first
         when /([IVX]+)$/
            ($1.rom - 1) * 100 + 50
         when /\.\s*(\d+)$/
            $1
         when /(?:\A|\s|\()(\d+)$/
            $1
         when /(?:\A|\s|\(|\.)(\d+) до (?:нэ|РХ)/
            "-#{$1}"
         when /(:|сент)/
            dates.last.split(".").last
         when /давно/
            '-3760'
         else
            dates = event.happened_at.split(/[\/-]/)
            if /(?:\A|\s|\(|\.)(\d+) до (?:нэ|РХ)/ =~ dates.first
               "-#{$1}"
            else
               '0'
            end
         end

      self.base_year
   end

   def quantity= value_in
      value = value_in.present? && value_in || nil

      super(value)
   end

   def set_slug
      self.slug = Slug.new(base: self.short_name) if self.slug.blank?
   end

   def to_s
      memory_names.join( ' ' )
   end
end
