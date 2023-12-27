FactoryBot.define do
   factory :picture do
      uid { Faker::Internet.uuid }
      type { "Picture" }
      meta { {} }

      transient do
         memory_title { nil }
         event_title { nil }
         image_path { 'features/fixtures/y2000-green.webp' }
         attitude_to { nil }
      end

      image { Rack::Test::UploadedFile.new(File.open(File.join(Rails.root, image_path))) }

      after(:build) do |o, e|
         o.memories << Memory.by_short_name(e.memory_title).first || build(:memory, short_name: e.memory_title) if e.memory_title
         o.events << Event.by_title(e.event_title).first || build(:event, title: e.event_title) if e.event_title
         o.attitudes << build(:image_attitude, attitude_to: e.attitude_to) if e.attitude_to
      end
   end
end
