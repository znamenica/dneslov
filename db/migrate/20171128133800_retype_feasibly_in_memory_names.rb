class RetypeFeasiblyInMemoryNames < ActiveRecord::Migration[4.2]
   safety_assured

   def change
      safety_assured do
         change_table :names do |t|
            t.remove :type ;end

         change_table :memory_names do |t|
            t.boolean :feasible, default: false, null: false ;end

         MemoryName.where(feasibly: 'feasible').update(feasible: true)

         remove_column :memory_names, :feasibly end;end;end
