class Admin::ItemsController < Admin::CommonController
   protected

   def model
      Item ;end

   def permitted_params
      params.require( :item ).permit() ;end

   def object_serializer
      Admin::ItemSerializer ;end

   def objects_serializer
      Admin::ItemsSerializer ;end;end
