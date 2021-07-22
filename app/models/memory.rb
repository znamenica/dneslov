# council[string]       - соборы для памяти
# short_name[string]    - краткое имя
# covers_to_id[integer] - прокровительство
# quantity[string]      - количество
# bond_to_id[integer]   - отношение к (для икон это замысел или оригинал списка)
#
class Memory < ActiveRecord::Base
   extend TotalSize
   extend DefaultKey
   extend Informatible

   has_default_key :short_name

   belongs_to :covers_to, class_name: :Place, optional: true
   belongs_to :bond_to, class_name: :Memory, optional: true

   has_one :slug, as: :sluggable, dependent: :destroy
   has_many :memory_names, dependent: :destroy
   has_many :names, through: :memory_names
   has_many :paterics, as: :info, dependent: :destroy, class_name: :PatericLink
   has_many :events, dependent: :destroy
   has_many :links, as: :info
   has_many :memos, through: :events
   has_many :service_cantoes, through: :services
   has_many :cantoes, through: :service_cantoes
   has_many :calendaries, -> { distinct.reorder('id') }, through: :memos
   has_many :thumb_links, as: :info, inverse_of: :info, class_name: :ThumbLink, dependent: :destroy
   has_many :photo_links, as: :info, inverse_of: :info, class_name: :IconLink, dependent: :destroy # ЧИНЬ во photos
   has_many :notes, as: :describable, dependent: :destroy, class_name: :Note
   has_many :orders, -> { distinct.reorder('id') }, through: :memos, source: :orders
   has_many :slugs, -> { distinct.reorder('id') }, through: :orders, source: :slug

   default_scope { order( base_year: :asc, short_name: :asc, id: :asc ) }

   scope :icons, -> { joins( :slugs ).where( slugs: { text: :обр } ) }

   scope :by_short_name, -> name { where( short_name: name ) }
   scope :by_slug, -> slug { unscoped.joins( :slug ).where( slugs: { text: slug })}

   scope :in_calendaries, -> calendaries_in do
      calendaries = calendaries_in.is_a?(String) && calendaries_in.split(',') || calendaries_in
      left_outer_joins( :memos ).merge( Memo.in_calendaries( calendaries )).distinct ;end

   scope :by_date, -> (date, julian = false) do
      left_outer_joins( :memos ).merge( Memo.by_date( date, julian )).distinct ;end

   scope :by_token, -> text do
      left_outer_joins(:names, :descriptions).where( "short_name ~* ?", "\\m#{text}.*" ).or(
         where("descriptions.text ~* ? OR names.text ~* ?", "\\m#{text}.*", "\\m#{text}.*")).distinct ;end

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

   scope :with_names, -> (language_code) do
      language_codes = [ language_code ].flatten
      selector = "COALESCE((
                        WITH __names AS (
                      SELECT names.alphabeth_code AS alphabeth_code,
                             names.language_code AS language_code,
                             names.bind_kind_code AS bind_kind_code,
                             names.text AS text,
                             memory_names.state_code AS state_code,
                             memory_names.mode AS mode,
                             memory_names.feasible AS feasible
                        FROM memory_names
             LEFT OUTER JOIN names
                          ON names.id = memory_names.name_id
                         AND names.language_code IN ('#{language_codes.join("', '")}')
                       WHERE memory_names.memory_id = memories.id
                         AND memory_names.id IS NOT NULL
                    GROUP BY text, mode, feasible, state_code, bind_kind_code,
                             language_code, alphabeth_code)
                      SELECT jsonb_agg(__names)
                        FROM __names), '[]'::jsonb) AS _names"

      select(selector).group(:id) ;end

   scope :with_pure_links, -> do
      selector = "COALESCE((SELECT jsonb_agg(links)
                              FROM links
                             WHERE links.info_id = memories.id
                               AND links.info_type = 'Memory'), '[]'::jsonb) AS _links"

      select(selector).group(:id) ;end

   scope :with_cantoes, -> (language_code) do
      language_codes = [ language_code ].flatten
      selector = self.select_values.dup
      if selector.empty?
         selector << 'memories.*'
      end
      selector << "COALESCE((SELECT jsonb_agg(cantoes)
                               FROM cantoes
                    LEFT OUTER JOIN services
                                 ON services.info_id = memories.id
                                AND services.info_type = 'Memory'
                    LEFT OUTER JOIN service_cantoes
                                 ON service_cantoes.service_id = services.id
                              WHERE cantoes.id = service_cantoes.canto_id
                                AND cantoes.language_code IN ('#{language_codes.join("', '")}')), '[]'::jsonb) AS _cantoes"

      select(selector).group(:id) ;end

   scope :with_slug_text, -> do
      selector = self.select_values.dup
      if selector.empty?
         selector << 'memories.*'
      end
      selector << 'slugs.text AS _slug'

      left_outer_joins(:slug).select(selector.uniq).group('_slug').order('_slug') ;end

   scope :with_note, -> language_code do
      selector = self.select_values.dup
      if selector.empty?
         selector << 'memories.*'
      end
      selector << 'titles.text AS _title'
      language_codes = [ language_code ].flatten
      join = "LEFT OUTER JOIN descriptions AS titles ON titles.describable_id = memories.id
                          AND titles.describable_type = 'Memory'
                          AND titles.type = 'Title'
                          AND titles.language_code IN ('#{language_codes.join("', '")}')"

      joins(join).select(selector.uniq).group('_title') ;end

   scope :with_slug, -> do
      selector = self.select_values.dup
      if self.select_values.dup.empty?
         selector << 'memories.*'
      end

      selector << "jsonb_build_object('id', slugs.id, 'text', slugs.text) AS _slug"
      join = "LEFT OUTER JOIN slugs
                           ON slugs.sluggable_id = memories.id
                          AND slugs.sluggable_type = 'Memory'"

      joins(join).select(selector).group(:id, 'slugs.id', 'slugs.text') ;end

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

      select(selector).group(:id) ;end

   scope :with_descriptions, -> context do
      language_codes = [ context[:locales] ].flatten
      alphabeth_codes = Languageble.alphabeth_list_for( language_codes ).flatten
      selector = self.select_values.dup
      if self.select_values.dup.empty?
         selector << 'memories.*'
      end

      selector << "COALESCE((with __descriptions as (
                      select distinct on(descriptions.id)
                             descriptions.id as id,
                             descriptions.type as type,
                             descriptions.text as text,
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
                       WHERE descriptions.describable_id = memories.id
                         AND descriptions.describable_type = 'Memory'
                         AND descriptions.type IN ('Description', 'Appellation')
                    GROUP BY descriptions.id, language_names.text, alphabeth_names.text)
                      SELECT jsonb_agg(__descriptions)
                        FROM __descriptions), '[]'::jsonb) AS _descriptions"

      select(selector).group(:id) ;end

   scope :with_links, -> context do
      language_codes = [ context[:locales] ].flatten
      alphabeth_codes = Languageble.alphabeth_list_for( language_codes ).flatten
      selector = self.select_values.dup
      if self.select_values.dup.empty?
         selector << 'memories.*'
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
             LEFT OUTER JOIN descriptions AS language_names
                          ON language_names.describable_id = languages.id
                         AND language_names.describable_type = 'Subject'
                         AND language_names.language_code IN ('#{language_codes.join("', '")}')
             LEFT OUTER JOIN subjects AS alphabeths
                          ON alphabeths.key = links.alphabeth_code
             LEFT OUTER JOIN descriptions AS alphabeth_names
                          ON alphabeth_names.describable_id = alphabeths.id
                         AND alphabeth_names.describable_type = 'Subject'
                         AND alphabeth_names.alphabeth_code IN ('#{alphabeth_codes.join("', '")}')
                       WHERE links.info_id = memories.id
                         AND links.info_type = 'Memory'
                    GROUP BY links.id, language_names.text, alphabeth_names.text)
                      SELECT jsonb_agg(__links)
                        FROM __links), '[]'::jsonb) AS _links"

      select(selector).group(:id) ;end

   scope :with_events, -> context do
      language_codes = [ context[:locales] ].flatten
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
                             item_names.text AS item,
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
             LEFT OUTER JOIN descriptions AS item_names
                          ON item_names.describable_id = events.item_id
                         AND item_names.describable_type = 'Item'
                         AND item_names.language_code IN ('#{language_codes.join("', '")}')
             LEFT OUTER JOIN subjects AS event_kinds
                          ON event_kinds.kind_code = 'EventKind'
                         AND event_kinds.key = events.kind_code
             LEFT OUTER JOIN descriptions AS event_kind_titles
                          ON event_kind_titles.describable_id = event_kinds.id
                         AND event_kind_titles.describable_type = 'Subject'
                         AND event_kind_titles.type = 'Appellation'
                         AND event_kind_titles.language_code IN ('#{language_codes.join("', '")}')
                       WHERE events.memory_id = memories.id
                    GROUP BY events.id, place_names.text, item_names.text, event_kind_titles.text)
                      SELECT jsonb_agg(__events)
                        FROM __events), '[]'::jsonb) AS _events"

      #binding.pry
      select(selector).group(:id) ;end

   scope :with_memory_names, -> context do
      language_codes = [ context[:locales] ].flatten
      selector = self.select_values.dup
      if self.select_values.dup.empty?
         selector << 'memories.*'
      end

      selector = "COALESCE((
                        WITH __memory_names AS (
                      SELECT memory_names.id AS id,
                             memory_names.name_id AS name_id,
                             names.text || ' (' || language_names.text || ')' AS name,
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
             LEFT OUTER JOIN names
                          ON names.id = memory_names.name_id
             LEFT OUTER JOIN subjects AS languages
                          ON languages.key = names.language_code
             LEFT OUTER JOIN descriptions AS language_names
                          ON language_names.describable_id = languages.id
                         AND language_names.describable_type = 'Subject'
                         AND language_names.language_code IN ('#{language_codes.join("', '")}')
                       WHERE memory_names.memory_id = memories.id
                         AND memory_names.id IS NOT NULL
                    GROUP BY memory_names.id, names.text, language_names.text, memory_name_state_titles.text)
                      SELECT jsonb_agg(__memory_names)
                        FROM __memory_names), '[]'::jsonb) AS _memory_names"

      #binding.pry
      select(selector).group(:id) ;end

   singleton_class.send(:alias_method, :t, :by_token)
   singleton_class.send(:alias_method, :q, :by_tokens)
   singleton_class.send(:alias_method, :d, :by_date)
   singleton_class.send(:alias_method, :c, :in_calendaries)

   accepts_nested_attributes_for :memory_names, reject_if: :all_blank, allow_destroy: true
   accepts_nested_attributes_for :paterics, reject_if: :all_blank, allow_destroy: true
   accepts_nested_attributes_for :events, reject_if: :all_blank, allow_destroy: true
   accepts_nested_attributes_for :memos, reject_if: :all_blank, allow_destroy: true
   accepts_nested_attributes_for :photo_links, reject_if: :all_blank, allow_destroy: true
   accepts_nested_attributes_for :covers_to, reject_if: :all_blank, allow_destroy: true
   accepts_nested_attributes_for :notes, reject_if: :all_blank, allow_destroy: true
   accepts_nested_attributes_for :slug, reject_if: :all_blank

   validates_presence_of :short_name, :events
   validates :base_year, format: { with: /\A-?\d+\z/ }

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
            '0' ;end;end

   self.base_year ;end

   #def attributes_before_type_cast()
   #   binding.pry
   #   super
   #end

   ATTRS = {
      created_at: nil,
      updated_at: nil,
   }

   def as_json options = {}
      attrs = ATTRS.merge(
         self.instance_variable_get(:@attributes).
            send(:attributes).
            send(:additional_types).merge(
               options.fetch(:externals, {})))
      original = super(options.merge(except: attrs.keys))

      attrs.reduce(original) do |r, (name, rule)|
         if /^_(?<realname>.*)/ =~ name
            r.merge(realname => read_attribute(name).as_json)
         elsif rule.is_a?(Proc)
            r.merge(name.to_s => rule[self])
         elsif rule.is_a?(ActiveRecord::Relation)
            r.merge(name.to_s => rule.as_json)
         else
            r
         end
      end
   end

   def set_slug
      self.slug = Slug.new(base: self.short_name) if self.slug.blank? ;end

   def to_s
      memory_names.join( ' ' )
   end
end
