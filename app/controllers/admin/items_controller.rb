class Admin::ItemsController < Admin::CommonController
   def all
      @items = model.by_token(params[ :t ])

      respond_to do |format|
         format.json { render :index, json: @items.limit(500),
                                      locales: @locales,
                                      serializer: Admin::AutocompleteSerializer,
                                      total: @items.count,
                                      each_serializer: Admin::ShortItemSerializer }
      end;end

   protected

   def model
      Item ;end

   def permitted_params
      params.require( :item ).permit() ;end

   def object_serializer
      Admin::ItemSerializer ;end

   def objects_serializer
      Admin::ItemsSerializer ;end;end
