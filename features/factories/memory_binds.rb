FactoryBot.define do
   factory :memory_bind do
      memory
      bond_to { memory }
      kind { "MyString" }
   end
end
