class MemoryNameSerializer < ApplicationSerializer
   attributes :id, :name_id, :feasibly, :mode, :name, :state

   def name
      object.name.text ;end;end
