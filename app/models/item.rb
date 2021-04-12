class Item < ActiveRecord::Base
   belongs_to :item_type
   has_many :events

   accepts_nested_attributes_for :item_type

   scope :by_token, -> token { unscoped.joins( :item_type ).merge(ItemType.with_token( token )) }

   singleton_class.send(:alias_method, :t, :by_token) ;end
