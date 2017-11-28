class MemoryNameSerializer < ApplicationSerializer
   attributes :id, :name_id, :feasible, :mode, :name, :state

   def name
      object.name.text ;end;end
