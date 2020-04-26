class Order < ActiveRecord::Base
   has_one :slug, as: :sluggable, dependent: :destroy
   has_many :notes, as: :describable, dependent: :delete_all, class_name: :Note
   has_many :tweets, as: :describable, dependent: :delete_all, class_name: :Tweet
   has_many :descriptions, -> { where( type: :Description ) }, as: :describable, dependent: :delete_all
   has_many :memo_orders
   has_many :memoes, through: :memo_orders
   has_many :memories, through: :slug

   accepts_nested_attributes_for :descriptions, reject_if: :all_blank, allow_destroy: true
   accepts_nested_attributes_for :notes, reject_if: :all_blank, allow_destroy: true
   accepts_nested_attributes_for :tweets, reject_if: :all_blank, allow_destroy: true
   accepts_nested_attributes_for :slug, reject_if: :all_blank

   scope :with_token, -> text do
      left_outer_joins( :slug, :descriptions, :notes, :tweets ).
         where( "slugs.text ~* ?", "\\m#{text}.*" ).or(
         where( "descriptions.text ~* ?", "\\m#{text}.*" ).or(
         where( "tweets_orders.text ~* ?", "\\m#{text}.*" ).or(
         where( "notes_orders.text ~* ?", "\\m#{text}.*" )))).distinct ;end


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

   singleton_class.send(:alias_method, :t, :with_token)
   singleton_class.send(:alias_method, :q, :with_tokens)

   validates_presence_of :slug, :notes, :tweets

   def tweet_for locales
      tweets.where( language_code: locales ).first ;end

   def note_for locales
      notes.where( language_code: locales ).first ;end;end

