class Admin::NamesController < Admin::CommonController
   protected

   def index_with_list
      %w(with_bind_kind_name with_bond_to_name with_root_name with_locale_names) ;end

   def permitted_params
      params.require( :name ).permit( :text, :language_code, :alphabeth_code, :root_id, :bind_kind_code, :bond_to_id ) ;end;end
