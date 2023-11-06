class MemoryBind < ApplicationRecord
   belongs_to :memory
   belongs_to :bond_to, class_name: :Memory
end
