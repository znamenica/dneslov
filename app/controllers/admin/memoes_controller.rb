class Admin::MemoesController < Admin::CommonController
   before_action :fetch_objects, only: %i(memoried all index)

   has_scope :by_memory_id, only: %i(index all)
   has_scope :by_calendary_id, only: %i(index all)
   has_scope :t, only: %i(memoried)

   def memoried
      all
   end

   protected

   def memoried_with_list
      %w(with_key with_value_memoried)
   end

   def index_with_list
      %w(with_descriptions with_links with_memory_event
         with_memo_orders with_bond_to_year_date with_calendary_title)
   end

   def permitted_params
      params.require(:memo).permit(:id, :year_date, :add_date, :calendary_id, :event_id, :bind_kind_code, :bond_to_id,
         memo_orders_attributes: %i(id order_id _destroy),
         links_attributes: %i(id url language_code alphabeth_code type _destroy),
         titles_attributes: %i(id text language_code alphabeth_code _destroy),
         notes_attributes: %i(id text language_code alphabeth_code _destroy),
         descriptions_attributes: %i(id text language_code alphabeth_code _destroy))
   end
end
