FactoryBot.define do
   factory :service do
      name { FFaker::Lorem.word }
      alphabeth_code { :РУ }
      language_code { :ру }

      association :info, factory: :memory ;end;end
