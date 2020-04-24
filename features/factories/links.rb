FactoryBot.define do
   factory :link do
      url { FFaker::Internet.http_url } ; end

   factory :language_link, parent: :link, class: :LanguageLink do
      alphabeth_code { :РУ }
      language_code { :ру } ; end

   factory :wiki_link, parent: :language_link, class: :WikiLink do
      association :info, factory: :memory ;end

   factory :icon_link, parent: :link, class: :IconLink do
      association :info, factory: :memory

      after( :build ) do |link, e|
         link.descriptions << build(:description, describable: link) ;end

      trait :without_descriptions do
         after( :build ) do |link, e|
            link.descriptions.map(&:destroy) ;end;end

      trait :with_invalid_description do
         after( :build ) do |link, e|
            link.descriptions << build(:invalid_description, describable: link)
            end;end;end;end
