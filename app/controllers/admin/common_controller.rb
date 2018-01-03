class Admin::CommonController < ApplicationController
   include Concerns::Auth
   include Pundit

   before_action :authenticate_user!, except: %i(dashboard)
   before_action :validate_session
   before_action :set_tokens, only: %i(index)
   before_action :set_page, only: %i(index)
   before_action :set_locales
   before_action :new_object, only: %i(create)
   before_action :fetch_object, only: %i(show update destroy)
   before_action :fetch_objects, only: %i(index)
   before_action :authorize!, except: %i(dashboard)
   layout 'admin'

   rescue_from ActiveRecord::RecordNotUnique,
               ActiveRecord::RecordInvalid,
               ActiveRecord::RecordNotSaved,
               ActiveRecord::RecordNotFound, with: :unprocessable_entity

   has_scope :with_token, only: %i(index all)
   has_scope :with_tokens, only: %i(index), type: :array

   # GET /<objects>/
   def index
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

      render json: @object, serializer: object_serializer, locales: @locales ;end

   # PUT /<objects>/1
   def update
      @object.update!( permitted_params )

      render json: @object, serializer: object_serializer, locales: @locales ;end

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

   def validate_session
      if session_lost?
         drop_session ;end;end

   def authorize!
      policy = Object.const_get(model.name + "Policy")
      if !policy.new(current_user, @object).send(action_name + '?')
         raise Pundit::NotAuthorizedError, "not allowed to do #{action_name} this #{@object.inspect}" ;end;end

   def unprocessable_entity e
      errors = @object.errors.any? && @object.errors || e.to_s
      render json: errors, status: :unprocessable_entity ;end

   def set_page
      @page ||= (params[:page] || 1).to_i ;end

   def set_locales
      #TODO unfix of the ru only (will depend on the locale)
      @locales ||= %i(ру цс) ;end

   def set_tokens
      @tokens ||= params[:with_tokens] || [] ;end

   def new_object
      @object = model.new( permitted_params ) ;end

   def fetch_objects
      @objects = apply_scopes( model ).page( params[:page] ) ;end

   def fetch_object
      if params[:slug]
         @object ||= model.by_slug(params[:slug])
      else
         @object ||= model.find(params[:id]) ;end ||
            raise(ActiveRecord::RecordNotFound) ;end;end
