class ChangeNullForLanguageCodeInLinks < ActiveRecord::Migration[5.2]
   def change
      change_column_null :links, :language_code, true
   end
end
