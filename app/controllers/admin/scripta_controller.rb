class Admin::ScriptaController < Admin::CommonController
   protected

   def index_with_list
      %w(with_locale_names)
   end

   def permitted_params
      params.require(:scriptum).permit(
         :id, :language_code, :alphabeth_code, :title, :text, :description, :prosomeion_title,
         :ref_title, :type, :author, :tone)
   end
end
