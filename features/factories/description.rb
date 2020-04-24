FactoryBot.define do
   factory :description do
      type { 'Description' }
      text { FFaker::NameRU.name }
      language_code { :ру }
      alphabeth_code { :РУ } ;end

   factory :appellation, class: :Appellation do
      type { 'Appellation' }
      text { FFaker::NameRU.name }
      language_code { :ру }
      alphabeth_code { :РУ } ;end

   factory :note, class: :Note do
      type { 'Note' }
      text { FFaker::NameRU.name }
      language_code { :ру }
      alphabeth_code { :РУ } ;end

   factory :tweet, class: :Tweet do
      type { 'Tweet' }
      text { FFaker::NameRU.name }
      language_code { :ру }
      alphabeth_code { :РУ } ;end

   factory :invalid_description, parent: :description do
      text { 'Invalid' }
      language_code { :ру }
      alphabeth_code { :РУ }
      end ;end
