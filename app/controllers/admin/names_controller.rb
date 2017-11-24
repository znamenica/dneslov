class Admin::NamesController < Admin::CommonController
   def all
      @names = model.with_token(params[:with_token])

      respond_to do |format|
         format.json { render :index, json: @names.limit(500),
                                      locales: @locales,
                                      serializer: Admin::AutocompleteSerializer,
                                      total: @names.count,
                                      each_serializer: Admin::ShortNameSerializer }
      end;end

   protected

   def model
      Name ;end

   def permitted_params
      params.require( :name ).permit() ;end

   def object_serializer
      Admin::NameSerializer ;end

   def objects_serializer
      Admin::NamesSerializer ;end;end
