class Admin::PlacesController < Admin::CommonController
   def all
      @places = model.with_token(params[:with_token])

      respond_to do |format|
         format.json { render :index, json: @places.limit(500),
                                      locales: @locales,
                                      serializer: Admin::AutocompleteSerializer,
                                      total: @places.count,
                                      each_serializer: Admin::ShortPlaceSerializer }
      end;end

   protected

   def model
      Place ;end

   def permitted_params
      params.require( :place ).permit() ;end

   def object_serializer
      Admin::PlaceSerializer ;end

   def objects_serializer
      Admin::PlacesSerializer ;end;end
