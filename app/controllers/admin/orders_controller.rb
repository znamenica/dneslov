class Admin::OrdersController < Admin::CommonController
   protected

   def index_with_list
      %w(with_descriptions with_links with_slug)
   end

   def permitted_params
      params.require(:order).permit(:id, :significance,
         slug_attributes: %i(id text),
         notes_attributes: %i(id text language_code alphabeth_code _destroy),
         tweets_attributes: %i(id text language_code alphabeth_code _destroy),
         links_attributes: %i(id url language_code alphabeth_code type _destroy),
         descriptions_attributes: %i(id text language_code alphabeth_code _destroy))
   end
end
