class Admin::MemoriesController < Admin::CommonController
   def icons
      @icons = model.icons.t(params[:t])

      respond_to do |format|
         format.json { render :index, json: @icons.limit(500),
                                      locales: @locales,
                                      serializer: Admin::AutocompleteSerializer,
                                      total: @icons.count,
                                      each_serializer: Admin::ShortMemorySerializer }
      end
   end

   protected

   def index_with_list
      %w(with_slug with_descriptions with_links with_events with_memory_names with_orders)
   end

   def permitted_params
      params.require(:memory).permit(
         :id, :covers_to_id, :bond_to_id, :short_name, :council, :quantity, :base_year,
         slug_attributes: [:id, :text],
         memory_names_attributes: [:id, :name_id, :state_code, :feasible, :ored, :_destroy],
         events_attributes: [
            :id, :happened_at, :kind_code, :person_name, :type_number,
            :about_string, :tezo_string, :council, :place_id, :item_id, :_destroy,
            titles_attributes: [ :id, :text, :language_code, :alphabeth_code, :_destroy ],
            descriptions_attributes: [ :id, :text, :language_code, :alphabeth_code, :_destroy ]],
         wikies_attributes: [:id, :url, :language_code, :alphabeth_code, :_destroy],
         beings_attributes: [:id, :url, :language_code, :alphabeth_code, :_destroy],
         paterics_attributes: [:id, :url, :language_code, :alphabeth_code, :_destroy],
         icons_attributes: [:id, :url, :_destroy],
         photos_attributes: [:id, :url, :_destroy],
         thumbs_attributes: [:id, :url, :_destroy],
         notes_attributes: [:id, :text, :language_code, :alphabeth_code, :_destroy],
         descriptions_attributes: [:id, :text, :language_code, :alphabeth_code, :_destroy])
   end
end
