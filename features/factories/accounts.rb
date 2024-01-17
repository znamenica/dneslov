FactoryBot.define do
   factory :account do
      no { Faker::Number.number(digits: 10) }
      type { nil }
      user
   end

   factory :email_account, parent: :account, class: "Account::Email" do
      no { Faker::Internet.email }
      type { "Account::Email" }
   end

   factory :uid_account, parent: :account, class: "Account::Uid" do
      type { "Account::Uid" }
   end
end
