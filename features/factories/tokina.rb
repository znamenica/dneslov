FactoryBot.define do
   factory :token do
      code { Faker::Alphanumeric.alphanumeric(number: 30, min_alpha: 3, min_numeric: 3) }
      expires_at { Faker::Time.between(from: DateTime.now, to: DateTime.now + 1)  }
      user
   end

   factory :validate_token, parent: :token, class: "Token::Validate" do
      type { "Token::Validate" }
      expires_at { Time.zone.now + 1.day }
   end

   factory :refresh_token, parent: :token, class: "Token::Refresh" do
      type { "Token::Refresh" }
      expires_at { Time.zone.now + 1.month }
   end

   factory :session_token, parent: :token, class: "Token::Session" do
      type { "Token::Session" }
      expires_at { Time.zone.now + 1.hour }
   end
end
