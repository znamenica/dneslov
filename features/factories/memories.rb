FactoryBot.define do
   factory :memory do
      short_name { FFaker::NameRU.name }

      after(:build) do |m, e|
         m.events << build(:event, memory: m)
      end
   end
end
