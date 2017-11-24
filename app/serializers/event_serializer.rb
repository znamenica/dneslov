class EventSerializer < ApplicationSerializer
   attributes :id, :type, :place_id, :item_id, :happened_at, :about_string, :tezo_string, :order, :council ;end
