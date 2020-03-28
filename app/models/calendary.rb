#licit[boolean]         - действительный календарь (не в разработке)
class Calendary < ActiveRecord::Base
   extend Language

   belongs_to :place, optional: true

   has_many :descriptions, -> { desc }, as: :describable, dependent: :delete_all
   has_many :names, as: :describable, dependent: :delete_all, class_name: :Appellation
   has_many :wikies, as: :info, dependent: :delete_all, class_name: :WikiLink
   has_many :links, as: :info, dependent: :delete_all, class_name: :BeingLink
   has_many :memos, dependent: :delete_all
   has_one :slug, as: :sluggable

   scope :licit, -> { where( licit: true ) }
   # scope :by_slug, -> slug { joins( :slug ).where( slugs: { text: slug } ) }
   scope :named_as, -> name { joins( :names ).where( names: { text: name } ) }
   scope :described_as, -> name { joins( :descriptions ).where( descriptions: { text: name } ) }
   scope :by_slugs, -> slugs do
      # TODO add correct sort by slugs pos
      select("calendaries.*, slugs.*").from("slugs, calendaries").where( "slugs.sluggable_id = calendaries.id AND slugs.sluggable_type = 'Calendary' AND slugs.text IN (?)", [slugs].flatten).reorder("slugs.text") ;end

   scope :with_token, -> text do
      left_outer_joins( :names, :descriptions ).where( "descriptions.text ILIKE ?", "%#{text}%" ) ;end

   scope :with_tokens, -> string_in do
      return self if string_in.blank?
      # TODO fix the correctness of the query
      klass = self.model_name.name.constantize
      rel_in = left_outer_joins( :names, :descriptions ).where( 'FALSE' )
      string_in.split(/\//).reduce(rel_in) do |rel, or_token|
         or_rel = or_token.strip.split(/\s+/).reduce(nil) do |rel, and_token|
            # AND operation
            and_rel = klass.with_token(and_token)
            rel && rel.merge(and_rel) || and_rel ;end
         # OR operation
         rel.or(or_rel);end
      .distinct ;end


   singleton_class.send(:alias_method, :t, :with_token)
   singleton_class.send(:alias_method, :q, :with_tokens)

   accepts_nested_attributes_for :descriptions, reject_if: :all_blank, allow_destroy: true
   accepts_nested_attributes_for :names, reject_if: :all_blank, allow_destroy: true
   accepts_nested_attributes_for :wikies, reject_if: :all_blank, allow_destroy: true
   accepts_nested_attributes_for :links, reject_if: :all_blank, allow_destroy: true
   accepts_nested_attributes_for :place, reject_if: :all_blank, allow_destroy: true
   accepts_nested_attributes_for :slug, reject_if: :all_blank, allow_destroy: true

   has_alphabeth
   validates :language_code, inclusion: { in: Language.language_list }
   validates :alphabeth_code, inclusion: { in: proc { |l| Language.alphabeth_list_for( l.language_code ) } }
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
