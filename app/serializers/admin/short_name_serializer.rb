class Admin::ShortNameSerializer < CommonCalendarySerializer
   attributes :id, :name
   
   def name
      object.text ;end;end
