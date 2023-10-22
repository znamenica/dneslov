class UseCodeFieldsForSubjects < ActiveRecord::Migration[5.2]
   def change
     rename_column(:subjects, :kind, :kind_code)
     rename_column(:memory_names, :state, :state_code)
     rename_column(:names, :bind_kind, :bind_kind_code)
     rename_column(:events, :kind, :kind_code)
   end
end
