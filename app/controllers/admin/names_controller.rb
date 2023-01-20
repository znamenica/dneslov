class Admin::NamesController < Admin::CommonController
   protected

   def index_with_list
      %w(with_bind_kind_name with_bond_to_name with_root_name with_locale_names with_descriptions with_links)
   end

   def permitted_params
      params.require(:name)
         .permit(:text, :language_code, :alphabeth_code, :root_id, :bind_kind_code, :bond_to_id,
         links_attributes: %i(id url language_code alphabeth_code type _destroy),
         descriptions_attributes: %i(id text language_code alphabeth_code _destroy))
   end
end
