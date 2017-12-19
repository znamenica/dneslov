class Admin::CalendariesController < Admin::CommonController
   def all
      @calendaries = apply_scopes(model)

      respond_to do |format|
         format.json { render :index, json: @calendaries.limit(500),
                                      locales: @locales,
                                      serializer: Admin::AutocompleteSerializer,
                                      total: @calendaries.count,
                                      each_serializer: Admin::ShortCalendarySerializer }
      end;end

   protected

   def model
      Calendary ;end

   def permitted_params
      params.require( :calendary ).permit( :licit, :language_code, :alphabeth_code, :author_name, :date, :council,
                                            slug_attributes: [:id, :text], names_attributes: [:id, :text, :language_code, :alphabeth_code],
                                            wikies_attributes: [:id, :url, :language_code, :alphabeth_code],
                                            links_attributes: [:id, :url, :language_code, :alphabeth_code],
                                            descriptions_attributes: [:id, :text, :language_code, :alphabeth_code] ) ;end

   def object_serializer
      Admin::CalendarySerializer ;end

   def objects_serializer
      Admin::CalendariesSerializer ;end;end
