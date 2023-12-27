FactoryBot.define do
   factory :thumb do
      thumbable { build(:event) }
      uid { Faker::Internet.uuid }

      transient do
         thumb_path { "features/fixtures/301x301-yellow.bmp" }
         short_name { nil }
         event_title { nil }
      end

      thumb { Rack::Test::UploadedFile.new(File.open(File.join(Rails.root, thumb_path))) }

      after(:build) do |o, e|
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
