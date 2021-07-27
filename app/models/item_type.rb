class ItemType < ActiveRecord::Base
   has_many :items
   has_many :descriptions, as: :describable

   scope :by_token, -> text { joins(:descriptions).where( "descriptions.text ~* ?", "\\m#{text}.*" ) }
   scope :descriptions_for, -> language_code { joins(:descriptions).where(descriptions: { language_code: language_code }) }

   singleton_class.send(:alias_method, :t, :by_token)

   accepts_nested_attributes_for :descriptions

   validates :descriptions, presence: true, associated: true
end
