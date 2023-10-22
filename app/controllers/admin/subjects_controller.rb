class Admin::SubjectsController < Admin::CommonController
   has_scope :k, only: %i(all)

   protected

   def index_with_list
      %w(with_descriptions with_links with_kind_title with_names)
   end

   def permitted_params
      params.require(:subject).permit(:id, :key, :meta, :kind_code,
         names_attributes: %i(id text language_code alphabeth_code _destroy),
         links_attributes: %i(id url language_code alphabeth_code type _destroy),
         descriptions_attributes: %i(id text language_code alphabeth_code _destroy) )
   end
end
