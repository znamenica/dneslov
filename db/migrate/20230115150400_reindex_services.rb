class ReindexServices < ActiveRecord::Migration[7.0]
   def change
      change_table :services do |t|
         t.remove_index %i(name alphabeth_code), unique: true

         t.index %i(info_id info_type name alphabeth_code),
            name: "index_services_on_info_id_info_type_name_alphabeth_code", unique: true
      end
   end
end
