class Admin::EventsController < Admin::CommonController
   has_scope :mid, only: %i(index all)

   protected

   def model
      Event ;end

   def permitted_params
      params.require( :event )
            .permit( :happened_at, :memory_id, :kind, :place_id, :item_id, :person_name,
                     :type_number, :about_string, :tezo_string, :order, :council ) ;end;end
