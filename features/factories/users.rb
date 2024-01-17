FactoryBot.define do
   factory :user do
      salt { Faker::Lorem.word }
      last_login_at { Faker::Time.between(from: DateTime.now - 1, to: DateTime.now)  }
      last_active_at { Faker::Time.between(from: DateTime.now - 1, to: DateTime.now)  }

      transient do
         password { Faker::Internet.password }
         validate_token { nil }
         refresh_token { nil }
         session_token { nil }
         no { nil }
         type { nil }
         account { {} }
      end

      settings { { name: 'Name.first_name', last_name: 'Name.last_name', sex: 'Gender.short_binary_type' } }

      trait :with_tokina do
         validate_token { build(:validate_token).code }
         refresh_token { build(:refresh_token).code }
         session_token { build(:session_token).code }
      end

      trait :with_account do
         after(:build) do |u, e|
            u.accounts << build(:email_account, user: u)
         end
      end

      after(:build) do |u, e|
         u.password ||= e.password
         u.password_confirmation ||= e.password
         u.accounts << build(:account, user: u, type: e.type, no: e.no) if e.no.present? or e.type.present?
         u.accounts << build(:account, user: u, **account) if e.account.present?
         u.tokina << build(:validate_token, code: e.validate_token) if e.validate_token
         u.tokina << build(:refresh_token, code: e.refresh_token) if e.refresh_token
         u.tokina << build(:session_token, code: e.session_token) if e.session_token
      end
   end
end
