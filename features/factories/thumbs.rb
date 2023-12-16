FactoryBot.define do
   factory :thumb do
      association :thumbable, factory: :event
      uid { Faker::Internet.uuid }
      thumb { Rack::Test::UploadedFile.new(File.open(File.join(Rails.root, 'features', 'fixtures', 'canvas.jpg'))) }

      transient do
         event_title { nil }
         thumb_path { nil }
      end

      after(:build) do |o, e|
         o.thumb = Rack::Test::UploadedFile.new(File.open(File.join(Rails.root, e.thumb_path))) if e.thumb_path
         o.thumbable = Event.by_title(e.event_title).first || build(:event, title: e.event_title) if e.event_title
      end
   end
end
