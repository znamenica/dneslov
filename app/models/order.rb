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

   validates_presence_of :slug, :notes, :tweets

   def tweet_for locales
      tweets.where( language_code: locales ).first ;end

   def note_for locales
      notes.where( language_code: locales ).first ;end;end

