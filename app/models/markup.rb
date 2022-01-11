class Markup < ActiveRecord::Base
   extend TotalSize
   extend AsJson

   belongs_to :scriptum
   belongs_to :reading
   acts_as_list scope: :reading

   # JSON_SCHEMA = Rails.root.join('config', 'schemas', 'calendary.json')
   #JSON_ATTRS = {
   #   meta: ->(this) { this.meta.to_json },
   #   created_at: nil,
   #   updated_at: nil,
   #}
   #EXCEPT = %i(created_at updated_at)

   #attr_defaults meta: "{}"

=begin
   scope :licit, -> { where( licit: true ) }
   scope :licit_with, ->(c) do
      if c.blank?
         self.licit
      else
         self.left_outer_joins(:slug).licit.or(self.by_slugs(c))
      end
   end
   scope :titled_as, -> name { joins( :titles ).where( descriptions: { text: name } ) }
   scope :described_as, -> name { joins( :descriptions ).where( descriptions: { text: name } ) }
   scope :by_slug, -> slug { joins( :slug ).where( slugs: { text: slug } ) }
   scope :by_slugs, -> slugs do
      return self if slugs.blank?
      # TODO add correct sort by slugs pos
      select("calendaries.*, slugs.*")
       .from("slugs, calendaries")
       .where( "slugs.sluggable_id = calendaries.id
            AND slugs.sluggable_type = 'Calendary'
            AND slugs.text IN (?)", [ slugs ].flatten)
       .reorder("slugs.text")
   end

   scope :by_token, -> text do
      left_outer_joins( :slug, :descriptions, :titles ).
         where( "calendaries.author_name ~* ?", "\\m#{text}.*" ).or(
         where( "calendaries.council ~* ?", "\\m#{text}.*" ).or(
         where( "slugs.text ~* ?", "\\m#{text}.*" ).or(
         where( "descriptions.text ~* ?", "\\m#{text}.*" ).or(
         where( "titles_calendaries.text ~* ?", "\\m#{text}.*" )))))
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
            rel && rel.merge(and_rel) || and_rel ;end;end
      or_rel = or_rel_tokens.reduce { |sum_rel, rel| sum_rel.or(rel) }
      self.merge(or_rel).distinct
   end

   singleton_class.send(:alias_method, :t, :by_token)
   singleton_class.send(:alias_method, :q, :by_tokens)

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

   # required for short list
   scope :with_key, -> _ do
      selector = ['calendaries.id AS _key']

      select(selector).group('_key') ;end

   scope :with_value, -> context do
      selector = [ 'descriptions.text AS _value' ]
      if self.select_values.dup.empty?
        selector.unshift( 'calendaries.*' )
      end

      language_codes = [ context[:locales] ].flatten
      join = "LEFT OUTER JOIN descriptions ON descriptions.describable_id = calendaries.id
                          AND descriptions.describable_type = 'Calendary'
                          AND descriptions.type = 'Appellation'
                          AND descriptions.language_code IN ('#{language_codes.join("', '")}')"

      joins(join).select(selector.uniq).group('_value')
   end

   scope :with_url, -> do
      selector = 'links.url AS _url'

      left_outer_joins(:links).select(selector).group('_url')
   end

   scope :with_title, -> language_code do
      selector = [ 'titles.text AS _title' ]
      if self.select_values.dup.empty?
        selector.unshift( 'calendaries.*' )
      end

      language_codes = [ language_code ].flatten
      join = "LEFT OUTER JOIN descriptions AS titles ON titles.describable_id = calendaries.id
                          AND titles.describable_type = 'Calendary'
                          AND titles.type = 'Appellation'
                          AND titles.language_code IN ('#{language_codes.join("', '")}')"

      joins(join).select(selector).group('_title')
   end

   scope :with_slug_text, -> do
      selector = self.select_values.dup
      if self.select_values.dup.empty?
         selector << 'calendaries.*'
      end

      selector << 'slugs.text AS _slug'

      left_outer_joins(:slug).group("slugs.text").select(selector)
   end

   scope :with_description, -> language_code do
      selector = [ 'descriptions.text AS _description' ]
      if self.select_values.dup.empty?
        selector.unshift( 'calendaries.*' )
      end

      language_codes = [ language_code ].flatten
      join = "LEFT OUTER JOIN descriptions ON descriptions.describable_id = calendaries.id
                          AND descriptions.describable_type = 'Calendary'
                          AND descriptions.type = 'Description'
                          AND descriptions.language_code IN ('#{language_codes.join("', '")}')"

      joins(join).select(selector.uniq).group('_description')
   end

   scope :with_slug, -> do
      selector = self.select_values.dup
      if self.select_values.dup.empty?
         selector << 'calendaries.*'
      end

      selector << "jsonb_build_object('id', calendary_slugs.id, 'text', calendary_slugs.text) AS _slug"
      join = "LEFT OUTER JOIN slugs AS calendary_slugs
                           ON calendary_slugs.sluggable_id = calendaries.id
                          AND calendary_slugs.sluggable_type = 'Calendary'"

      joins(join).select(selector).group(:id, 'calendary_slugs.id', 'calendary_slugs.text')
   end

   scope :with_locale_names, -> context do
      language_codes = [ context[:locales] ].flatten
      alphabeth_codes = Languageble.alphabeth_list_for( language_codes ).flatten
      selector = self.select_values.dup
      if self.select_values.dup.empty?
         selector << 'calendaries.*'
      end
      selector.concat [ "language_names.text AS _language", "alphabeth_names.text AS _alphabeth" ]

      join = "LEFT OUTER JOIN subjects AS languages
                           ON languages.key = calendaries.language_code
              LEFT OUTER JOIN descriptions AS language_names
                           ON language_names.describable_id = languages.id
                          AND language_names.describable_type = 'Subject'
                          AND language_names.language_code IN ('#{language_codes.join("', '")}')
              LEFT OUTER JOIN subjects AS alphabeths
                           ON alphabeths.key = calendaries.alphabeth_code
              LEFT OUTER JOIN descriptions AS alphabeth_names
                           ON alphabeth_names.describable_id = alphabeths.id
                          AND alphabeth_names.describable_type = 'Subject'
                          AND alphabeth_names.alphabeth_code IN ('#{alphabeth_codes.join("', '")}')"

      joins(join).select(selector.uniq).group('language_names.text', 'alphabeth_names.text')
   end

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

      select(selector).group(:id)
   end

   scope :with_links, -> context do
      language_codes = [ context[:locales] ].flatten
      alphabeth_codes = Languageble.alphabeth_list_for( language_codes ).flatten
      selector = self.select_values.dup
      if self.select_values.dup.empty?
         selector << 'calendaries.*'
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
                       WHERE links.info_id = calendaries.id
                         AND links.info_type = 'Calendary'
                    GROUP BY links.id, language_names.text, alphabeth_names.text)
                      SELECT jsonb_agg(__links)
                        FROM __links), '[]'::jsonb) AS _links"

      select(selector).group(:id)
   end

   accepts_nested_attributes_for :descriptions, reject_if: :all_blank, allow_destroy: true
   accepts_nested_attributes_for :titles, reject_if: :all_blank, allow_destroy: true
   accepts_nested_attributes_for :wikies, reject_if: :all_blank, allow_destroy: true
   accepts_nested_attributes_for :beings, reject_if: :all_blank, allow_destroy: true
   accepts_nested_attributes_for :place, reject_if: :all_blank, allow_destroy: true
   accepts_nested_attributes_for :slug, reject_if: :all_blank, allow_destroy: true

   has_alphabeth
   validates :language_code, inclusion: { in: Languageble.language_list }
   validates :alphabeth_code, inclusion: { in: proc { |l| Languageble.alphabeth_list_for(l.language_code)}}
   validates :slug, :titles, :date, presence: true
   validates :descriptions, :titles, :wikies, :beings, :place, associated: true
   validates :meta, json: { schema: JSON_SCHEMA }

   def as_json options = {}
      additionals = self.instance_variable_get(:@attributes).send(:attributes).send(:additional_types)
      original = super(options.merge(except: EXCEPT | additionals.keys))

      additionals.keys.reduce(original) do |r, key|
         if /^_(?<name>.*)/ =~ key
            r.merge(name => read_attribute(key).as_json)
         else
            r
         end
      end
   end
=end
end
