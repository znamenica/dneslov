class Admin::MemoryNamesController < Admin::CommonController
   def all
      @names = model.with_token(params[ :t ])

      respond_to do |format|
         format.json { render :index, json: @names.limit(500),
                                      locales: @locales,
                                      serializer: Admin::AutocompleteSerializer,
                                      total: @names.count,
                                      each_serializer: Admin::ShortNameSerializer }
      end;end

   protected

   def model
      Name ;end

   def permitted_params
      params.require( :name ).permit( :text, :language_code, :alphabeth_code, :root_id, :bind_kind_code, :bond_to_id ) ;end

   def object_serializer
      Admin::NameSerializer ;end

   def objects_serializer
      Admin::NamesSerializer ;end;end
