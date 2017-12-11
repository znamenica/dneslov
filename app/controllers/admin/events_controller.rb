class Admin::EventsController < Admin::CommonController
   has_scope :with_token, only: %i(index all)
   has_scope :with_memory_id, only: %i(index all)

   def all
      @events = apply_scopes(model)

      respond_to do |format|
         format.json { render :index, json: @events.limit(500),
                                      locales: @locales,
                                      serializer: Admin::AutocompleteSerializer,
                                      total: @events.count,
                                      each_serializer: Admin::ShortEventSerializer }
      end;end

   protected

   def model
      Event ;end

   def permitted_params
      params.require( :name ).permit( :text, :language_code, :alphabeth_code, :root_id, :bind_kind, :bond_to_id ) ;end

   def object_serializer
      Admin::EventSerializer ;end

   def objects_serializer
      Admin::EventsSerializer ;end;end
