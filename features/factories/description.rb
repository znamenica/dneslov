FactoryBot.define do
   factory :description do
      type { 'Description' }
      text { FFaker::NameRU.name }
      language_code { :ру }
      alphabeth_code { :РУ }
   end

   factory :title, parent: :description, class: :Title do
      type { 'Title' }
   end

   factory :appellation, parent: :description, class: :Appellation do
      type { 'Appellation' }
   end

   factory :note, parent: :description, class: :Note do
      type { 'Note' }
   end

   factory :tweet, parent: :description, class: :Tweet do
      type { 'Tweet' }
   end

   factory :invalid_description, parent: :description do
      text { 'Invalid' }
   end
end
