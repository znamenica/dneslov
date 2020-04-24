FactoryBot.define do
   factory :name do
      text { FFaker::NameRU.first_name }
      alphabeth_code { :РУ }
      language_code { :ру } ;end;end
