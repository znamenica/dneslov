FactoryBot.define do
   factory :account do
      no { Faker::Number.number(digits: 10) }
      type { nil }
      user
   end

   factory :uid_account, parent: :account, class: :UidAccount do
      type { "Account::Uid" }
   end
end
