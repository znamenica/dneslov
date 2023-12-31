FactoryBot.define do
   factory :memo do
      calendary { build(:calendary) }
      event { build(:event) }
      year_date { "10.10%6" }
   end
end
