class CalendariesController < ApplicationController
   before_action :set_calendary, only: %i(show)
   layout 'admin'

   rescue_from ActiveRecord::RecordInvalid, ActiveRecord::RecordNotSaved, with: :unprocessable_entity

   # GET /calendaries/
   def index
      calendaries = Calendary.page( params[:page] )

      render :index, locals: {
         locales: locales,
         calendaries: calendaries } ;end

   # GET /calendaries/create
   def create
      @calendary = Calendary.new( permitted_params )

      @calendary.save!

      render json: @calendary ;end

   # GET /calendaries/1
   def show
      render :show, locals: {
         locales: locales,
         calendary: @calendary.decorate } ;end

   protected

   def permitted_params
      params.require( :calendary ).permit( :licit, :language_code, :alphabeth_code, :author_name, :date, :council,
                                            slug_attributes: [:text], names_attributes: [:id, :text, :language_code, :alphabeth_code],
                                            wikies_attributes: [:id, :url, :language_code, :alphabeth_code],
                                            links_attributes: [:id, :url, :language_code, :alphabeth_code],
                                            descriptions_attributes: [:id, :text, :language_code, :alphabeth_code] ) ;end

   def unprocessable_entity
      render json: @calendary.errors, status: :unprocessable_entity ;end

   def locales
      @locales ||= %i(ру цс) ;end #TODO unfix of the ru only (will depend on the locale)

   def set_calendary
      @calendary = Calendary.by_slug( params[:slug] ) || raise( ActiveRecord::RecordNotFound ) ;end;end
