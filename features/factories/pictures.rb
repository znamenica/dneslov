FactoryBot.define do
   factory :picture do
      image { Rack::Test::UploadedFile.new(File.open(File.join(Rails.root, 'features', 'fixtures', 'canvas.jpg'))) }
      uid { Faker::Internet.uuid }
      type { "Picture" }
      meta { {} }

      transient do
         memory_title { nil }
         event_title { nil }
         image_path { nil }
      end

      after(:build) do |o, e|
         o.image = Rack::Test::UploadedFile.new(File.open(File.join(Rails.root, e.image_path))) if e.image_path
         o.memories << Memory.by_short_name(e.memory_title).first || build(:memory, short_name: e.memory_title) if e.memory_title
         o.events << Event.by_title(e.event_title).first || build(:event, title: e.event_title) if e.event_title
      end
   end
end
