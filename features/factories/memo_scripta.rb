FactoryBot.define do
   factory :memo_scriptum do
      scriptum { build(:scriptum) }
      memo { build(:memo) }
      kind { "To" }
   end
end
