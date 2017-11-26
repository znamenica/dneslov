class Admin::PlacesController < Admin::CommonController
   before_action :set_places, only: %i(all)

   def all
      respond_to do |format|
         format.json { render :index, json: @places.limit(500),
                                      locales: @locales,
                                      serializer: Admin::AutocompleteSerializer,
                                      total: @places.count,
                                      each_serializer: Admin::ShortPlaceSerializer }
      end;end

   protected

   def set_places
      @places =
      if params[:with_token]
         model.with_token(params[:with_token])
      elsif params[:with_value] && params[:value_name]
         model.where(params[:value_name] => params[:with_value])
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
