FactoryBot.define do
   factory :user do
#      settings { Faker::Json.shallow_json(width: 3, options: { name: 'Name.first_name', last_name: 'Name.last_name', sex: 'Gender.short_binary_type' }) }
      salt { Faker::Lorem.word }
      last_login_at { Faker::Time.between(from: DateTime.now - 1, to: DateTime.now)  }
      last_active_at { Faker::Time.between(from: DateTime.now - 1, to: DateTime.now)  }

      transient do
         password { Faker::Internet.password }
         validate_token { nil }
         refresh_token { nil }
         session_token { nil }
#         settings { 
#Faker::Json.shallow_json(width: 3, options: { name: 'Name.first_name', last_name: 'Name.last_name', sex: 'Gender.short_binary_type' }) }
      end

      settings { { name: 'Name.first_name', last_name: 'Name.last_name', sex: 'Gender.short_binary_type' } }

      after(:build) do |u, e|
         u.password ||= e.password
         u.password_confirmation ||= e.password
         u.tokina << build(:validate_token, code: e.validate_token) if e.validate_token
         u.tokina << build(:refresh_token, code: e.refresh_token) if e.refresh_token
         u.tokina << build(:session_token, code: e.session_token) if e.session_token
      end
   end
end
