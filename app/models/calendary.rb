#licit[boolean]         - действительный календарь (не в разработке)
class Calendary < ActiveRecord::Base
   extend TotalSize
   include Languageble
   include WithLocaleNames
   include WithDescriptions
   include WithLinks

   JSON_SCHEMA = Rails.root.join('config', 'schemas', 'calendary.json')
   JSONIZE_ATTRS = {
      meta: ->(this) { this.meta.to_json },
   }

   attr_defaults meta: "{}"

   belongs_to :place, optional: true

   has_many :titles, as: :describable, dependent: :delete_all, class_name: :Appellation
   has_many :wikies, as: :info, dependent: :delete_all, class_name: :WikiLink
   has_many :beings, as: :info, dependent: :delete_all, class_name: :BeingLink
   has_many :memos, dependent: :delete_all
   has_one :slug, as: :sluggable

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
   scope :by_slug, -> slug { joins( :slug ).where( slugs: { text: slug.split(",") } ) }
   scope :by_slugs, -> slugs do
      return self if slugs.blank?
      slugs = slugs.split(",") if slugs.is_a?(String)
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
         where( "unaccent(calendaries.author_name) ~* unaccent(?)", "\\m#{text}.*" ).or(
         where( "unaccent(calendaries.council) ~* unaccent(?)", "\\m#{text}.*" ).or(
         where( "slugs.text ~* ?", "\\m#{text}.*" ).or(
         where( "unaccent(descriptions.text) ~* unaccent(?)", "\\m#{text}.*" ).or(
         where( "unaccent(titles_calendaries.text) ~* unaccent(?)", "\\m#{text}.*" )))))
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

   accepts_nested_attributes_for :titles, reject_if: :all_blank, allow_destroy: true
   accepts_nested_attributes_for :place, reject_if: :all_blank, allow_destroy: true
   accepts_nested_attributes_for :slug, reject_if: :all_blank, allow_destroy: true

   has_alphabeth
   validates :language_code, inclusion: { in: Languageble.language_list }
   validates :alphabeth_code, inclusion: { in: proc { |l| Languageble.alphabeth_list_for(l.language_code)}}
   validates :slug, :titles, :date, presence: true
   validates :titles, :place, associated: true
   validates :meta, json: { schema: JSON_SCHEMA }

   def default_title
      titles.first.text
   end
end
