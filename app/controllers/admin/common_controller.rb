class Admin::CommonController < ApplicationController
   include Concerns::Auth
   include Pundit

   before_action :authenticate_user!, except: %i(dashboard)
   before_action :validate_session
   before_action :set_query, only: %i(index)
   before_action :set_page, only: %i(index)
   before_action :set_locales
   before_action :new_object, only: %i(create)
   before_action :fetch_object, only: %i(show update destroy)
   before_action :fetch_objects, only: %i(all index)
   before_action :authorize!, except: %i(dashboard)
   layout 'admin'

   rescue_from ActiveRecord::RecordNotUnique,
               ActiveRecord::RecordInvalid,
               ActiveRecord::RecordNotSaved,
               ActiveRecord::RecordNotFound,
               StandardError, with: :unprocessable_entity

   has_scope :t, only: %i(index all)
   has_scope :q, only: %i(index)

   def all
      respond_to do |format|
         format.json { render :index, json: @objects.limit(500),
                                      locales: @locales,
                                      serializer: Admin::AutocompleteSerializer,
                                      total: @objects.total_count,
                                      each_serializer: short_object_serializer } ;end;end

   # GET /<objects>/
   def index
      # binding.pry
      respond_to do |format|
         format.json { render :index, json: @objects, locales: @locales,
                                      serializer: objects_serializer,
                                      total: @objects.total_count,
                                      page: @page,
                                      each_serializer: object_serializer }
         format.html { render :index } end;end



   # POST /<objects>/create
   def create
      @object.save!

      render json: prepare_object( @object ),
             serializer: object_serializer,
             locales: @locales ;end

   # PUT /<objects>/1
   def update
      @object.update!( permitted_params )

      render json: prepare_object( @object ),
             serializer: object_serializer,
             locales: @locales ;end

   # GET /<objects>/1
   def show
      respond_to do |format|
         format.json { render :show, json: @object, locales: @locales,
                                     serializer: object_serializer } ;end;end

   # DELETE /<objects>/1
   def destroy
      @object.destroy

      respond_to do |format|
         format.json { render :show, json: @object, locales: @locales,
                                     serializer: object_serializer } ;end;end

   def dashboard
   end

   protected

   def model
     self.class.to_s.gsub(/.*::/, "").gsub("Controller", "").singularize.constantize
   end

   def short_object_serializer
     "Admin::Short#{model}Serializer".constantize
   end

   def object_serializer
     "Admin::#{model}Serializer".constantize
   end

   def objects_serializer
     "Admin::#{model.to_s.pluralize}Serializer".constantize
   end

   def validate_session
      if session_lost?
         drop_session ;end;end

   def authorize!
      policy = Object.const_get(model.name + "Policy")
      if !policy.new(current_user, @object).send(action_name + '?')
         raise Pundit::NotAuthorizedError, "not allowed to do #{action_name} this #{@object.inspect}" ;end;end

   def unprocessable_entity e
      Rails.logger.error("#{e.class}: #{e.message}\n\t#{e.backtrace.join("\n\t")}")

      errors = @object.errors.any? && @object.errors || e.to_s
      render json: errors, status: :unprocessable_entity ;end

   def set_page
      @page ||= (params[ :p ] || 1).to_i ;end

   def set_locales
      #TODO unfix of the ru only (will depend on the locale)
      @locales ||= %i(ру цс) ;end

   def set_query
      @query ||= params[ :q ] || "" ;end

   def new_object
      @object = model.new( permitted_params ) ;end

   def context
      { locales: @locales } ;end

   def include_list
      [] ;end

   def with_list
      [] ;end

   def issue_with query, with_method
      query.send( with_method, context )
   rescue ArgumentError
      query.send( with_method ) ;end

   def prepare_object object
      prepare_objects.where(id: object.id).first
   end

   def prepare_objects
      pre = include_list.reduce( apply_scopes( model )) { |q, i| q.includes( i ) }

      with_list.reduce( pre ) { |q, with_method| issue_with( q, with_method )} ;end

   def fetch_objects
      @objects = prepare_objects.page( params[ :p ]) ;end

   def fetch_object
      if params[:slug]
         @object ||= prepare_objects.by_slug(params[:slug]).first
      else
         @object ||= prepare_objects.find(params[:id]) ;end ||
            raise(ActiveRecord::RecordNotFound) ;end;end
