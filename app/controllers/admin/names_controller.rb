class Admin::NamesController < Admin::CommonController
   protected

   def permitted_params
      params.require( :name ).permit( :text, :language_code, :alphabeth_code, :root_id, :bind_kind_code, :bond_to_id ) ;end;end
