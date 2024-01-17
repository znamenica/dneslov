FactoryBot.define do
   factory :account do
      no { Faker::Number.number(digits: 10) }
      type { nil }
      user

      transient do
         validate_token { nil }
      end

      trait :with_tokina do
         validate_token { build(:validate_token).code }
      end

      after(:build) do |a, e|
         a.tokina << build(:validate_token, code: e.validate_token) if e.validate_token
      end
   end

   factory :email_account, parent: :account, class: "Account::Email" do
      no { Faker::Internet.email }
      type { "Account::Email" }
   end

   factory :uid_account, parent: :account, class: "Account::Uid" do
      type { "Account::Uid" }
   end
end
