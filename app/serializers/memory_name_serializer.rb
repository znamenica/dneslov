class MemoryNameSerializer < ApplicationSerializer
   attributes :id, :feasible, :mode, :name, :state

   def name
      object.name&.text ;end;end
