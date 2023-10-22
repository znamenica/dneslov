class CreateServiceChants < ActiveRecord::Migration[5.2]
   def change
      create_table :service_chants do |t|
         t.belongs_to  :service, null: false
         t.belongs_to  :chant, null: false

         t.index %i(service_id chant_id), unique: true
      end
   end
end
