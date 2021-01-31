class FixIndecesInNames < ActiveRecord::Migration[5.2]
   def change
      change_table :names do |t|
         t.index %i(id language_code)
         t.index %i(alphabeth_code)
         t.index %i(language_code alphabeth_code) ;end;end;end
