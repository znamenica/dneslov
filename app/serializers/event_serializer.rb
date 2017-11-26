class EventSerializer < ApplicationSerializer
   attributes :id, :type, :place_id, :item_id, :happened_at, :about_string,
              :tezo_string, :order, :council, :place, :item

   def place
      object.place&.description_for(@instance_options[:locales])&.text ;end

   def item
      object.item&.item_type&.description_for(@instance_options[:locales])&.text ;end;end
