class Subject < ActiveRecord::Base
   JSON_SCHEMA = Rails.root.join('config', 'schemas', 'subject.json').to_s

   attr_defaults meta: "{}"

   has_many :names, as: :describable, dependent: :delete_all, class_name: :Appellation
   has_many :descriptions, -> { where( type: :Description ) }, as: :describable, dependent: :delete_all

   accepts_nested_attributes_for :names, reject_if: :all_blank, allow_destroy: true
   accepts_nested_attributes_for :descriptions, reject_if: :all_blank, allow_destroy: true

   validates_presence_of :key, :kind
   validates_uniqueness_of :key
   validates :meta, json: { schema: JSON_SCHEMA }

   scope :with_token, -> text do
      left_outer_joins(:names, :descriptions)
     .where("descriptions.text ILIKE ?", "%#{text}%")
     .distinct ;end

   scope :with_tokens, -> string_in do
      return self if string_in.blank?
      # TODO fix the correctness of the query
      klass = self.model_name.name.constantize
      rel_in = left_outer_joins( :names, :descriptions, :memos ).where( 'FALSE' )
      string_in.split(/\//).reduce(rel_in) do |rel, or_token|
         or_rel = or_token.strip.split(/\s+/).reduce(nil) do |rel, and_token|
            # AND operation
            and_rel = klass.with_token(and_token)
            rel && rel.merge(and_rel) || and_rel ;end
         # OR operation
         rel.or(or_rel);end
      .distinct ;end

   scope :with_kind, -> kind do
      where(kind: kind) ;end

   singleton_class.send(:alias_method, :t, :with_token)
   singleton_class.send(:alias_method, :q, :with_tokens)
   singleton_class.send(:alias_method, :k, :with_kind)

   def name_for language_codes
     names.where( language_code: language_codes ).first&.text ;end;end
