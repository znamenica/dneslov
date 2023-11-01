class MemoScriptum < ApplicationRecord
   belongs_to :scriptum
   belongs_to :memo
   has_one :memory, through: :memo

   validates :kind, inclusion: { in: %w(To From About Author) }
end
