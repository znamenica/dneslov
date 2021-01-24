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
   has_many :titles, -> { title }, as: :describable, class_name: :Description do
      def by_default this
        self.or( Appellation.merge( this.kind.names ))
           .order( :describable_type ).distinct ;end;end

   has_many :default_titles, -> { distinct }, through: :kind, source: :names, class_name: :Appellation
   has_many :all_titles, ->(this) do
      where( describable_type: "Event", describable_id: this.id, kind: "Title" )
        .or( Appellation.merge(this.kind.names) )
     .order( :describable_type )
   end, primary_key: nil, class_name: :Description

   # synod : belongs_to
   # czin: has_one/many
   default_scope -> { order(:created_at) }

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

   scope :with_description, -> language_code do
      selector = self.select_values.dup
      if selector.empty?
         selector << 'events.*'
      end
      selector << 'descriptions.text AS _description'
      language_codes = [ language_code ].flatten
      join = "LEFT OUTER JOIN descriptions ON descriptions.describable_id = events.id
                          AND descriptions.describable_type = 'Event'
                          AND descriptions.type = 'Description'
                          AND descriptions.language_code IN ('#{language_codes.join("', '")}')"

      joins(join).select(selector.uniq).group('_description') ;end

   scope :with_title, -> language_code do
      selector = self.select_values.dup
      if selector.empty?
         selector << 'events.*'
      end
      selector << 'titles.text AS _title'
      selector << 'titles.describable_type AS _title_type'
      language_codes = [ language_code ].flatten
      join = "LEFT OUTER JOIN subjects AS event_kinds
                           ON event_kinds.kind_code = 'EventKind'
                          AND event_kinds.key = events.kind_code
              LEFT OUTER JOIN descriptions AS titles
                           ON (titles.describable_id = events.id
                          AND titles.describable_type = 'Event'
                          AND titles.type = 'Title'
                           OR titles.describable_id = event_kinds.id
                          AND titles.describable_type = 'Subject'
                          AND titles.type = 'Appellation')
                          AND titles.language_code IN ('#{language_codes.join("', '")}')"

      joins(join).select(selector)
                 .order( '_title_type' )
                 .group( '_title', '_title_type' ) ;end

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
      selector = "COALESCE((WITH submemoes AS (
                       SELECT memoes.year_date AS year_date,
                              jsonb_object_agg(DISTINCT memo_slugs.text,
                                                        order_titles_memoes.text) AS orders,
                              memo_titles.text AS title,
                              calendary_slugs.text AS calendary_slug,
                              calendary_descriptions.text AS calendary_title
                         FROM memoes
              LEFT OUTER JOIN slugs AS calendary_slugs
                           ON calendary_slugs.sluggable_id = memoes.calendary_id
                          AND calendary_slugs.sluggable_type = 'Calendary'
              LEFT OUTER JOIN descriptions AS memo_titles
                           ON memo_titles.describable_id = memoes.id
                          AND memo_titles.describable_type = 'Memo'
                          AND memo_titles.type = 'Title'
                          AND memo_titles.language_code IN ('#{language_codes.join("', '")}')
              LEFT OUTER JOIN descriptions AS calendary_descriptions
                           ON calendary_descriptions.describable_id = memoes.calendary_id
                          AND calendary_descriptions.describable_type = 'Calendary'
                          AND calendary_descriptions.type = 'Appellation'
                          AND calendary_descriptions.language_code IN ('#{language_codes.join("', '")}')
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
                        WHERE memoes.event_id = events.id
                          AND memoes.id IS NOT NULL
                     GROUP BY year_date, title, calendary_slug, calendary_title)
                       SELECT jsonb_agg(submemoes)
                         FROM submemoes), '{}'::jsonb) AS _memoes"

      binding.pry
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
                                AND cantoes.language_code IN ('#{language_codes.join("', '")}')), '{}'::jsonb) AS _cantoes"

      select(selector).group(:id) ;end

   accepts_nested_attributes_for :place, reject_if: :all_blank
   accepts_nested_attributes_for :coordinate, reject_if: :all_blank
   accepts_nested_attributes_for :item, reject_if: :all_blank
   accepts_nested_attributes_for :titles, reject_if: :all_blank, allow_destroy: true

   singleton_class.send(:alias_method, :t, :by_token)
   singleton_class.send(:alias_method, :mid, :by_memory_id)

   validates_presence_of :kind, :kind_code

   def self.year_date_for year_date, date_in, julian
      return nil if date_in.blank?

      date = date_in.is_a?(Time) && date_in || Time.parse(date_in)
      if /(?<day>\d+)\.(?<month>\d+)%(?<weekday>\d+)$/ =~ year_date
         base_date = Date.parse("#{date.year}-#{month}-#{day}")
         base_offset = weekday.to_i - base_date.wday
         (base_date + (base_offset < 1 && (base_offset + 7) || base_offset)).strftime("%d.%m")
      elsif /(?<offset>[+-]\d+)/ =~ year_date
         gap = (julian && 13.days || 0)
         easter = WhenEaster::EasterCalendar.find_greek_easter_date(date.year) - gap
         (easter + offset.to_i.days).strftime("%d.%m")
      else
         year_date ;end;end

   def title_for language_code
     titles.with_default( self ).where( language_code: language_code ).first ;end

   def memo_in_calendary calendary
      memos.where( calendary_id: calendary ) ;end

   def memo_description_for language_code, calendary_slugs
      memos.for(calendary_slugs).first&.description_for( language_code ) ;end

   def description_for language_code
      descriptions.where(language_code: language_code).first ;end

   def troparions text_present = true
      relation = Troparion.joins( :services ).where( services: { id: services.pluck( :id ) } )
      text_present && relation.where.not( { text: nil } ) || relation ;end

   def troparions_for language_code, text_present = true
      troparions( text_present ).where(language_code: language_code) ;end

   def kontakions text_present = true
      relation = Kontakion.joins( :services ).where( services: { id: services.pluck( :id ) } )
      text_present && relation.where.not( { text: nil } ) || relation ;end

   def kontakions_for language_code, text_present = true
      kontakions( text_present ).where(language_code: language_code) ;end

   # serialization
   def happened_at= value
      value.is_a?(Array) && super(value.join('/')) || super
   end

   def happened_at
      value = read_attribute(:happened_at)
      value.to_s =~ /,/ && value.split(/,\*/) || value ;end;end
