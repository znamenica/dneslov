class FixIndecesInDescriptions < ActiveRecord::Migration[5.2]
   def change
      change_table :descriptions do |t|
         t.index %i(language_code)
         t.index %i(alphabeth_code)
         t.index %i(describable_id describable_type)
         t.index %i(type)
         t.index %i(language_code type describable_id describable_type), name: :index_on_language_code_type_and_describables
         t.index %i(id type describable_id describable_type), name: :index_on_id_type_and_describables
         t.index %i(id language_code type describable_id describable_type), name: :index_on_id_language_code_type_and_describables
         t.index %i(language_code alphabeth_code type describable_id describable_type), name: :index_on_language_code_alphabeth_code_type_and_describables
      end
   end
end
