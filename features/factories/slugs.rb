FactoryBot.define do
   factory :slug do
      text { FFaker::NameRU.name.downcase.gsub(" ", '') }

      association :sluggable, factory: :calendary ;end;end
