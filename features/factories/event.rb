FactoryBot.define do
   factory :event do
      happened_at { Date.today.to_s }
      kind_code { 'Canonization' }

      association :item
      association :memory
      association :place end;end
