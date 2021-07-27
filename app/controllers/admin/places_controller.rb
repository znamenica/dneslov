class Admin::PlacesController < Admin::CommonController
   before_action :set_places, only: %i(all)

   protected

   def set_places
      @places =
      if params[ :t ]
         model.by_token(params[ :t ])
      elsif params[ :v ] && params[ :value_name ]
         model.where(params[ :v ] => params[ :v ])
      else
         model.none ;end;end

   def model
      Place ;end

   def permitted_params
      params.require( :place ).permit() ;end

   def object_serializer
      Admin::PlaceSerializer ;end

   def objects_serializer
      Admin::PlacesSerializer ;end;end
