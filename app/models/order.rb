class Order < ActiveRecord::Base
   has_one :slug, as: :sluggable, dependent: :destroy
   has_many :notes, as: :describable, dependent: :delete_all, class_name: :Note
   has_many :tweets, as: :describable, dependent: :delete_all, class_name: :Tweet
   has_many :descriptions, as: :describable, dependent: :delete_all
   has_many :memo_orders
   has_many :memoes, through: :memo_orders
   has_many :memories, through: :slug

   accepts_nested_attributes_for :descriptions, reject_if: :all_blank, allow_destroy: true
   accepts_nested_attributes_for :notes, reject_if: :all_blank, allow_destroy: true
   accepts_nested_attributes_for :tweets, reject_if: :all_blank, allow_destroy: true
   accepts_nested_attributes_for :slug, reject_if: :all_blank, allow_destroy: true

   scope :with_token, -> text do
      left_outer_joins(:slug).where( "slugs.text ~* ?", "\\m#{text}.*" ).distinct ;end

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

   singleton_class.send(:alias_method, :t, :with_token)
   singleton_class.send(:alias_method, :q, :with_tokens)

   validates_presence_of :slug, :notes, :tweets

   def tweet_for locales
      tweets.where( language_code: locales ).first ;end

   def note_for locales
      notes.where( language_code: locales ).first ;end;end

