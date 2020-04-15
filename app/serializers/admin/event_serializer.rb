class Admin::EventSerializer < ApplicationSerializer
   attributes :id, :kind, :kind_name, :place_id, :item_id, :happened_at, :about_string,
              :tezo_string, :order, :council, :place, :item, :person_name, :titles

   def titles
      ActiveModel::Serializer::CollectionSerializer.new(object.titles,
                                                        locales: locales,
                                                        serializer: Admin::DescriptionSerializer) ;end


   def kind_name
      Subject.where( key: object.kind ).first&.name_for( locales ) ;end

   def place
      object.place&.description_for( locales )&.text ;end

   def item
      object.item&.item_type&.description_for( locales )&.text ;end;end
