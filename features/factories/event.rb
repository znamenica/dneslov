FactoryBot.define do
   factory :event do
      happened_at { Date.today.to_s }
      kind_code { 'Canonization' }

      association :item
      association :memory
      association :place

      transient do
         title { FFaker::NameRU.name }
         memory_title { nil }
      end

      after(:build) do |o, e|
         o.titles << build(:title, text: e.title)
         o.memory = Memory.by_short_name(e.memory_title).first || build(:memory, short_name: e.memory_title) if e.memory_title
      end
   end
end
