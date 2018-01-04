class Admin::MemoryNameSerializer < ApplicationSerializer
   attributes :id, :feasible, :name_id, :name, :state, :mode
   
   def name
      object.name.text ;end;end
