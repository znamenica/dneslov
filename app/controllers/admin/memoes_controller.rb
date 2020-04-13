class Admin::MemoesController < Admin::CommonController
   protected

   def permitted_params
      params.require( :memo ).permit( :id, :year_date, :add_date, :calendary_id, :event_id, :bind_kind, :bond_to_id,
         memo_orders_attributes: [ :id, :order_id, :_destroy ],
         links_attributes: [ :id, :url, :language_code, :alphabeth_code, :_destroy ],
         titles_attributes: [ :id, :text, :language_code, :alphabeth_code, :_destroy ],
         descriptions_attributes: [ :id, :text, :language_code, :alphabeth_code, :_destroy ]) ;end;end
