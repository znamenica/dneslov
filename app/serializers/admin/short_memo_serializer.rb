class Admin::ShortMemoSerializer < CommonCalendarySerializer
   attributes :id, :memo
   
   def memo
      object.year_date ;end;end
