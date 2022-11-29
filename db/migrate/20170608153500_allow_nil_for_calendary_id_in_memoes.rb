class AllowNilForCalendaryIdInMemoes < ActiveRecord::Migration[5.2]
   def change
      change_column_null :memoes, :calendary_id, true
   end
end
