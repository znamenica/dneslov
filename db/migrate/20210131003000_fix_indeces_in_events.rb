class FixIndecesInEvents < ActiveRecord::Migration[5.2]
   def change
      change_table :events do |t|
         t.index %i(kind_code)
         t.index %i(happened_at)
         t.index %i(memory_id), if_not_exists: true
         t.index %i(item_id), if_not_exists: true
         t.index %i(person_name)
         t.index %i(type_number)
         t.index %i(order)
         t.index %i(council)
         t.index %i(tezo_string)
         t.index %i(about_string)
         t.index %i(place_id), if_not_exists: true
      end
   end
end
