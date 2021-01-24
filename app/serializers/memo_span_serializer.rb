class MemoSpanSerializer < ApplicationSerializer
   attributes :thumb_url, :slug, :title, :happened_at, :description, :calendary_slug,
              :orders, :year_date, :base_year, :add_date, :bind_kind_code, :bond_to_title, :event_title

   def happened_at
      object._happened_at ;end

   def thumb_url
      object._thumb_url ;end

   def slug
      object._slug ;end

   def title
      object._title ;end

   def description
      object._description ;end

   def calendary_slug
      object._calendary_slug ;end

   def base_year
      object._base_year ;end

   def orders
     object._orders; end

   def bond_to_title
      object._bond_to_title ;end

   def event_title
      object._event_title ;end;end
