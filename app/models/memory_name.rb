class MemoryName < ActiveRecord::Base
   belongs_to :memory
   belongs_to :name
   belongs_to :state, primary_key: :key, foreign_key: :state_code, class_name: :Subject

   enum mode: [ :ored, :prefix ]

   accepts_nested_attributes_for :name, reject_if: :all_blank

   validates_presence_of :memory, :name, :state

   def name_attributes= value
      self.name = Name.where(value).first || super && name ;end

   def to_s
      name.text ;end;end
