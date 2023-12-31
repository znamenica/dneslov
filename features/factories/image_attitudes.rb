FactoryBot.define do
   factory :image_attitude do
      imageable { build(:event) }
      pos { "<(50,100),30>" }

      transient do
         attitude_to { nil }
      end

      imageable_name { attitude_to&.sub(/\(.*/, '') }
      pos_at { attitude_to&.sub(/.*\(/, '') }
   end
end
