class Admin::MemorySerializer < ApplicationSerializer
   attributes :id, :short_name, :slug, :orders, :council, :quantity, :base_year,
              :beings, :wikies, :paterics, :descriptions, :memory_names, :events, :notes

   def slug
      object._slug ;end

   def orders
      object._orders ;end

   def notes
      object._descriptions.select { |d| d[ "type" ] == 'Note' } ;end

   def descriptions
      object._descriptions.select { |d| d[ "type" ] == 'Description' } ;end

   def wikies
      object._links.select { |l| l[ "type" ] == 'WikiLink' } ;end

   def beings
      object._links.select { |l| l[ "type" ] == "BeingLink" } ;end

   def paterics
      object._links.select { |l| l[ "type" ] == "PatericLink" } ;end

   def events
      object._events ;end

   def memory_names
      object._memory_names ;end;end
