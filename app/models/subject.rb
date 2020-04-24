class Subject < ActiveRecord::Base
   JSON_SCHEMA = Rails.root.join('config', 'schemas', 'subject.json').to_s

   attr_defaults meta: "{}"

   belongs_to :kind, primary_key: :key, foreign_key: :kind_code, class_name: :Subject

   has_many :names, as: :describable, dependent: :delete_all, class_name: :Appellation do
      def for language_codes
         where( language_code: language_codes ).first ;end;end

   has_many :descriptions, -> { where( type: :Description ) }, as: :describable, dependent: :delete_all do
      def for language_codes
         where( language_code: language_codes ).first ;end;end

   scope :with_token, -> text do
      left_outer_joins(:names, :descriptions)
     .where("descriptions.text ILIKE ?", "%#{text}%")
     .distinct ;end

   scope :with_tokens, -> string_in do
      return self if string_in.blank?
      # TODO fix the correctness of the query
      klass = self.model_name.name.constantize
      or_rel_tokens = string_in.split(/\//).map do |or_token|
         # OR operation
         or_token.strip.split(/\s+/).reduce(nil) do |rel, and_token|
            # AND operation
            and_rel = klass.with_token(and_token)
            rel && rel.merge(and_rel) || and_rel ;end;end
      or_rel = or_rel_tokens.reduce { |sum_rel, rel| sum_rel.or(rel) }
      self.merge(or_rel).distinct ;end

   scope :with_kind_code, -> kind_code do
      where(kind_code: kind_code) ;end

   singleton_class.send(:alias_method, :t, :with_token)
   singleton_class.send(:alias_method, :q, :with_tokens)
   singleton_class.send(:alias_method, :k, :with_kind_code)

   accepts_nested_attributes_for :names, reject_if: :all_blank, allow_destroy: true
   accepts_nested_attributes_for :descriptions, reject_if: :all_blank, allow_destroy: true

   validates_presence_of :key, :kind_code
   validates_uniqueness_of :key
   validates :meta, json: { schema: JSON_SCHEMA } ;end

