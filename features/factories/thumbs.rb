FactoryBot.define do
   factory :thumb do
      thumbable { build(:event) }
      uid { Faker::Internet.uuid }
      thumb { Rack::Test::UploadedFile.new(File.open(File.join(Rails.root, 'features', 'fixtures', 'canvas.jpg'))) }

      transient do
         thumb_path { nil }
         short_name { nil }
         event_title { nil }
      end

      after(:build) do |o, e|
         o.thumb = Rack::Test::UploadedFile.new(File.open(File.join(Rails.root, e.thumb_path))) if e.thumb_path

         o.thumbable =
            if e.event_title
               Event.by_title_and_short_name(e.event_title, e.short_name).first || build(:event, title: e.event_title)
            elsif e.short_name
               Memory.by_short_name(e.short_name) || build(:memory, short_name: e.short_name)
            else
               e.thumbable
            end

         o.thumbable_name = e.thumbable_name if e.thumbable_name
      end
   end
end
