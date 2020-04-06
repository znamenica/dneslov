class Admin::NamesController < Admin::CommonController
   has_scope :t, only: %i(index)

   def all
      @names = model.w(params[ :t ])

      espond_to do |format|
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
      params.require( :name ).permit( :text, :language_code, :alphabeth_code, :root_id, :bind_kind, :bond_to_id ) ;end

   def object_serializer
      Admin::NameSerializer ;end

   def objects_serializer
      Admin::NamesSerializer ;end;end
