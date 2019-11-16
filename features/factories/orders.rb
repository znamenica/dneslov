FactoryBot.define do
   factory :order do
      text { FFaker::NameRU.first_name }
      alphabeth_code { :ру }
      language_code { :ру }
      note { 'тест' }
      short_note { 'текст' }
      order { 'св' } ;end;end
