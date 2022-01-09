FactoryBot.define do
   factory :calendary do
      date { Faker::Date.forward(days: 23) }
      author_name { Faker::Superhero.name }
      language_code { :ру }
      alphabeth_code { :РУ }
      meta { '{ "fast_days": [] }' }

      transient do
         slug { nil }
         descriptions { true }
         titles { true }
      end

      after(:build) do |calendary, e|
         if e.slug.present?
            calendary.slug = build(:slug, sluggable: calendary, text: e.slug)
         end

         if e.descriptions.present?
            calendary.descriptions = build_list(:description, 1, describable: calendary)
         end

         if e.titles.present?
            calendary.titles = build_list(:appellation, 1, describable: calendary)
         end
      end

      trait( :with_invalid_description ) do
         after( :build ) do |calendary, e|
            calendary.descriptions = build_list :invalid_description, 1, describable: calendary
         end
      end
   end
end
