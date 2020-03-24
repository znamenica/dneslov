class MemoOrder < ActiveRecord::Base
   belongs_to :memo
   belongs_to :order

   validates_presence_of :order ;end
