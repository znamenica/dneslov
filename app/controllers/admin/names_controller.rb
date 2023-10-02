class Admin::NamesController < Admin::CommonController
   protected

   def index_with_list
      %w(by_root with_locale_names with_descriptions with_links with_nomina)
   end

   def permitted_params
      params.require(:name)
         .permit(:text, :language_code, :alphabeth_code,
         nomina_attributes: %i(id root_id bind_kind_name bond_to_id _destroy),
         links_attributes: %i(id url language_code alphabeth_code type _destroy),
         descriptions_attributes: %i(id text language_code alphabeth_code _destroy))
   end
end
