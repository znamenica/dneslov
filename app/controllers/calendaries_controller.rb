class CalendariesController < ApplicationController
   before_action :set_page, only: %i(index)
   before_action :set_locales
   before_action :set_calendary, only: %i(show update destroy)
   layout 'admin'

   rescue_from ActiveRecord::RecordInvalid,
               ActiveRecord::RecordNotSaved,
               ActiveRecord::RecordNotFound, with: :unprocessable_entity

   # GET /calendaries/
   def index
      @calendaries = Calendary.page( params[:page] )

      respond_to do |format|
         format.json { render :index, json: @calendaries, locales: @locales,
                                      serializer: CalendariesSerializer,
                                      total: @calendaries.total_count,
                                      page: @page,
                                      each_serializer: Admin::CalendarySerializer }
         format.html { render :index } end;end

   # GET /calendaries/create
   def create
      @calendary = Calendary.new( permitted_params )

      @calendary.save!

      render json: @calendary ;end

   # GET /calendaries/update
   def update
      @calendary.update!( permitted_params )

      render json: @calendary, serializer: Admin::CalendarySerializer ;end

   # GET /calendaries/1
   def show
      respond_to do |format|
         format.json { render :show, json: @calendary, locales: @locales,
                                     serializer: Admin::CalendarySerializer } ;end;end

   # DELETE /calendaries/1
   def destroy
      @calendary.destroy

      respond_to do |format|
         format.json { render :show, json: @calendary, locales: @locales,
                                     serializer: Admin::CalendarySerializer } ;end;end

   protected

   def permitted_params
      params.require( :calendary ).permit( :licit, :language_code, :alphabeth_code, :author_name, :date, :council,
                                            slug_attributes: [:id, :text], names_attributes: [:id, :text, :language_code, :alphabeth_code],
                                            wikies_attributes: [:id, :url, :language_code, :alphabeth_code],
                                            links_attributes: [:id, :url, :language_code, :alphabeth_code],
                                            descriptions_attributes: [:id, :text, :language_code, :alphabeth_code] ) ;end

   def unprocessable_entity
      render json: @calendary.errors, status: :unprocessable_entity ;end

   def set_page
      @page ||= params[:page].to_i || 1 ;end

   def set_locales
      @locales ||= %i(ру цс) ;end #TODO unfix of the ru only (will depend on the locale)

   def set_calendary
      @calendary = Calendary.by_slug( params[:slug]) || raise( ActiveRecord::RecordNotFound ) ;end;end
