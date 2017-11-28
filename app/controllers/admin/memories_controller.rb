class Admin::MemoriesController < Admin::CommonController
   before_action :set_memory, only: %i(show)

   has_scope :with_date, only: %i(index), allow_blank: false, type: :array do |_, scope, value|
      scope.with_date(*value) ;end
   has_scope :with_tokens, only: %i(index), type: :array
   has_scope :in_calendaries, only: %i(index), type: :array

   def icons
      @icons = model.icons.with_token(params[:with_token])

      respond_to do |format|
         format.json { render :index, json: @icons.limit(500),
                                      locales: @locales,
                                      serializer: Admin::AutocompleteSerializer,
                                      total: @icons.count,
                                      each_serializer: Admin::IconMemorySerializer }
      end;end

   protected

   def model
      Memory ;end

   def permitted_params
      params.require( :memory ).permit(
         :view_string, :covers_to_id, :sight_id, :short_name, :order, :council, :quantity,
         slug_attributes: [:id, :text],
         memory_names_attributes: [:id, :name_id, :state, :feasible, :ored],
         events_attributes: [
            :id, :happened_at, :type, :person_name, :type_number,
            :about_string, :tezo_string, :order, :council], #place_id, #item_id
         wikies_attributes: [:id, :url, :language_code, :alphabeth_code],
         beings_attributes: [:id, :url, :language_code, :alphabeth_code],
         paterics_attributes: [:id, :url, :language_code, :alphabeth_code],
         descriptions_attributes: [:id, :text, :language_code, :alphabeth_code] ) ;end

   def object_serializer
      Admin::MemorySerializer ;end

   def objects_serializer
      MemoriesSerializer ;end;end
