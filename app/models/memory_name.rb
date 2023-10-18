class MemoryName < ActiveRecord::Base
   belongs_to :memory
   belongs_to :nomen
   belongs_to :state, primary_key: :key, foreign_key: :state_code, class_name: :Subject

   enum mode: [ :ored, :prefix ]

   accepts_nested_attributes_for :nomen, reject_if: :all_blank

   validates_presence_of :memory, :nomen, :state

   def nomen_attributes= value
      self.nomen = Nomen.where(value).first || super && nomen
   end

   def to_s
      nomen.text
   end
end
