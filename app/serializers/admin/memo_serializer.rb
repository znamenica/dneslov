class Admin::MemoSerializer < ApplicationSerializer
   attributes :id, :year_date, :add_date, :calendary_id, :calendary, :event_id, :event, :bind_kind_code,
              :bond_to_id, :bond_to, :memory, :memory_id, :descriptions, :links, :titles, :memo_orders

   def year_date
      object.year_date ;end

   def memory_id
      object._memory_id ;end

   def memory
      object._memory_name ;end

   def calendary
      object._calendary_title ;end

   def event
      object._event_short_title ;end

   def bond_to
      object._bond_to_year_date ;end

   def memo_orders
      object._memo_orders ;end

   def titles
      object._descriptions.select { |d| d['type'] == 'Title' } ;end

   def descriptions
      object._descriptions.select { |d| d['type'] == 'Description' } ;end

   def links
      object._links ;end;end
