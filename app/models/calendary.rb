#licit[boolean]         - действительный календарь (не в разработке)
class Calendary < ActiveRecord::Base
   include Languageble

   belongs_to :place, optional: true

   has_many :descriptions, -> { where( type: :Description ).desc }, as: :describable, dependent: :delete_all
   has_many :names, as: :describable, dependent: :delete_all, class_name: :Appellation
   has_many :wikies, as: :info, dependent: :delete_all, class_name: :WikiLink
   has_many :links, as: :info, dependent: :delete_all, class_name: :BeingLink
   has_many :memos, dependent: :delete_all
   has_one :slug, as: :sluggable

   scope :licit, -> { where( licit: true ) }
   scope :licit_with, ->(c) do
      if c.blank?
         self.licit
      else
         self.left_outer_joins(:slug).licit.or(self.by_slugs(c)) end;end
   # scope :by_slug, -> slug { joins( :slug ).where( slugs: { text: slug } ) }
   scope :named_as, -> name { joins( :names ).where( names: { text: name } ) }
   scope :described_as, -> name { joins( :descriptions ).where( descriptions: { text: name } ) }
   scope :by_slugs, -> slugs do
      return self if slugs.blank?
      # TODO add correct sort by slugs pos
      select("calendaries.*, slugs.*").from("slugs, calendaries").where( "slugs.sluggable_id = calendaries.id AND slugs.sluggable_type = 'Calendary' AND slugs.text IN (?)", [slugs].flatten).reorder("slugs.text") ;end

   scope :by_token, -> text do
      left_outer_joins( :slug, :descriptions, :names ).
         where( "calendaries.author_name ~* ?", "\\m#{text}.*" ).or(
         where( "calendaries.council ~* ?", "\\m#{text}.*" ).or(
         where( "slugs.text ~* ?", "\\m#{text}.*" ).or(
         where( "descriptions.text ~* ?", "\\m#{text}.*" ).or(
         where( "names_calendaries.text ~* ?", "\\m#{text}.*" ))))) end

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

   singleton_class.send(:alias_method, :t, :by_token)
   singleton_class.send(:alias_method, :q, :by_tokens)

   scope :with_url, -> do
      selector = 'links.url AS _url'

      left_outer_joins(:links).select(selector) ;end

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

      joins(join).select(selector) ;end


   scope :with_slug, -> do
      selector = 'slugs.text AS _slug'

      left_outer_joins(:slug).select(selector) ;end

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

      joins(join).select(selector.uniq) ;end

   accepts_nested_attributes_for :descriptions, reject_if: :all_blank, allow_destroy: true
   accepts_nested_attributes_for :names, reject_if: :all_blank, allow_destroy: true
   accepts_nested_attributes_for :wikies, reject_if: :all_blank, allow_destroy: true
   accepts_nested_attributes_for :links, reject_if: :all_blank, allow_destroy: true
   accepts_nested_attributes_for :place, reject_if: :all_blank, allow_destroy: true
   accepts_nested_attributes_for :slug, reject_if: :all_blank, allow_destroy: true

   has_alphabeth
   validates :language_code, inclusion: { in: Languageble.language_list }
   validates :alphabeth_code, inclusion: { in: proc { |l| Languageble.alphabeth_list_for( l.language_code ) } }
   validates :slug, :names, :date, presence: true
   validates :descriptions, :names, :wikies, :links, :place, associated: true

   class << self
      def by_slug slug
         joins( :slug ).where( slugs: { text: slug } ).first ;end;end

   def link_for language_code
      links.where(language_code: language_code).first ;end

   def description_for language_codes
      descriptions.where( language_code: language_codes ).first ;end

   def name_for language_codes
      names.where( language_code: language_codes ).first ;end;end
