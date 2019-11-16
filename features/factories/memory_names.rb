FactoryBot.define do
   factory :memory_name do
      state { :наречёное }
      feasible { true }

      association :memory, factory: :memory
      association :name, factory: :name
   end
end
