class Admin::ScriptaController < Admin::CommonController
   protected

   def index_with_list
      %w(with_locale_names with_memoried_memoes)
   end

   def permitted_params
      params.require(:scriptum).permit(
         :id, :language_code, :alphabeth_code, :title, :text, :description, :prosomeion_title,
         :ref_title, :type, :author, :tone,
         memo_scripta_attributes: %i(id memo_id kind _destroy))
   end
end
