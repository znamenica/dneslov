class ChangeNullForAlphabethCode < ActiveRecord::Migration[5.2]
   def change
      change_column_null :links, :alphabeth_code, true
   end
end
