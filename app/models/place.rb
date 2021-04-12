class Place < ActiveRecord::Base
   has_many :descriptions, as: :describable
   has_many :events

   scope :by_token, -> text { joins(:descriptions).where( "descriptions.text ~* ?", "\\m#{text}.*" ) }

   singleton_class.send(:alias_method, :t, :by_token)

   accepts_nested_attributes_for :descriptions, reject_if: :all_blank, allow_destroy: true

   validates :descriptions, presence: true
   validates :descriptions, associated: true ;end
