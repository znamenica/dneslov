class Admin::CommonController < ApplicationController
   before_action :set_page, only: %i(index)
   before_action :set_locales
   before_action :set_memory, only: %i(show update destroy)
   layout 'admin'

   rescue_from ActiveRecord::RecordNotUnique,
               ActiveRecord::RecordInvalid,
               ActiveRecord::RecordNotSaved,
               ActiveRecord::RecordNotFound, with: :unprocessable_entity

   # GET /<objects>/
   def index
      @objects = model.page( params[:page] )

      respond_to do |format|
         format.json { render :index, json: @objects, locales: @locales,
                                      serializer: objects_serializer,
                                      total: @objects.total_count,
                                      page: @page,
                                      each_serializer: object_serializer }
         format.html { render :index } end;end

   # POST /<objects>/create
   def create
      @object = model.new( permitted_params )

      @object.save!

      render json: @object, serializer: object_serializer ;end

   # PUT /<objects>/1
   def update
      @object.update!( permitted_params )

      render json: @object, serializer: object_serializer ;end

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

   protected

   def unprocessable_entity e
      errors = @object.errors.any? && @object.errors || e.to_s
      render json: errors, status: :unprocessable_entity ;end

   def set_page
      @page ||= params[:page].to_i || 1 ;end

   def set_locales
      #TODO unfix of the ru only (will depend on the locale)
      @locales ||= %i(ру цс) ;end

   def set_object
      @object ||= model.by_slug(params[:slug]) || raise(ActiveRecord::RecordNotFound) ;end;end
