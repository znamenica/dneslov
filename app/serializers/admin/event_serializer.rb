class Admin::EventSerializer < ApplicationSerializer
   attributes :id, :type, :type_name, :place_id, :item_id, :happened_at, :about_string,
              :tezo_string, :order, :council, :place, :item, :person_name

   def type_name
      Subject.where( key: object.type ).first&.name_for( locales ) ;end

   def place
      object.place&.description_for( locales )&.text ;end

   def item
      object.item&.item_type&.description_for( locales )&.text ;end;end
