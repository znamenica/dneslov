class Admin::OrdersController < Admin::CommonController
   has_scope :with_tokens, only: %i(index), type: :array

   def all
      @orders = model.with_token(params[:with_token])

      respond_to do |format|
         format.json { render :index, json: @orders.limit(500),
                                      locales: @locales,
                                      serializer: Admin::AutocompleteSerializer,
                                      total: @orders.count,
                                      each_serializer: Admin::ShortOrderSerializer }
      end;end

   protected

   def model
      Order ;end

   def permitted_params
      params.require( :order ).permit(
         :id,
         slug_attributes: [:id, :text],
         notes_attributes: [:id, :text, :language_code, :alphabeth_code],
         tweets_attributes: [:id, :text, :language_code, :alphabeth_code],
         descriptions_attributes: [:id, :text, :language_code, :alphabeth_code] ) ;end


   def object_serializer
      Admin::OrderSerializer ;end

   def objects_serializer
      Admin::OrdersSerializer ;end;end
