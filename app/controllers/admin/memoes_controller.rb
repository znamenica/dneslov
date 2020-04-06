class Admin::MemoesController < Admin::CommonController
   has_scope :with_event_id, only: %i(index all)
   has_scope :with_calendary_id, only: %i(index all)

   def all
      @memoes = apply_scopes(model)

      respond_to do |format|
         format.json { render :index, json: @memoes.limit(500),
                                      locales: @locales,
                                      serializer: Admin::AutocompleteSerializer,
                                      total: @memoes.count,
                                      each_serializer: Admin::ShortMemoSerializer }
      end;end

   protected

   def model
      Memo ;end

   def permitted_params
      params.require( :memo ).permit( :id, :year_date, :add_date, :calendary_id, :event_id, :bind_kind, :bond_to_id,
         memo_orders_attributes: [ :id, :order_id, :_destroy ],
         links_attributes: [ :id, :url, :language_code, :alphabeth_code, :_destroy ],
         titles_attributes: [ :id, :text, :language_code, :alphabeth_code, :_destroy ],
         descriptions_attributes: [ :id, :text, :language_code, :alphabeth_code, :_destroy ]) ;end

   def object_serializer
      Admin::MemoSerializer ;end

   def objects_serializer
      Admin::MemoesSerializer ;end;end
