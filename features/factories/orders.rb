FactoryBot.define do
   factory :order do
      transient do
         order { 'Чин' }
      end

      after(:build) do |o, ev|
         o.slug = build(:slug, sluggable: o)
         o.descriptions << build(:description)
         o.notes << build(:note, text: ev.order)
         o.tweets << build(:tweet)
      end
   end
end
