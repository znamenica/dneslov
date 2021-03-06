class Admin::MemoesController < Admin::CommonController
   protected

   def with_list
      %w(with_descriptions with_links with_memory_event
         with_memo_orders with_bond_to_year_date with_calendary_title) ;end

   def permitted_params
      params.require( :memo ).permit( :id, :year_date, :add_date, :calendary_id, :event_id, :bind_kind_code, :bond_to_id,
         memo_orders_attributes: [ :id, :order_id, :_destroy ],
         links_attributes: [ :id, :url, :language_code, :alphabeth_code, :_destroy ],
         titles_attributes: [ :id, :text, :language_code, :alphabeth_code, :_destroy ],
         descriptions_attributes: [ :id, :text, :language_code, :alphabeth_code, :_destroy ]) ;end;end
