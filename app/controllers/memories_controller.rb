class MemoriesController < ApplicationController
   before_action :set_locales
   before_action :set_calendary_cloud
   before_action :set_date, only: %i(index)
   before_action :set_calendaries, only: %i(index)
   before_action :set_selections, only: %i(index)
   before_action :set_memory, only: %i(show)

   has_scope :with_date, only: %i(index)
   has_scope :with_text, only: %i(index)
   has_scope :for_calendaries, only: %i(index) do |_, scope, value|
      scope.for_calendaries( value.split(',') ) ;end

   # GET /memories,/,/index
   # GET /memories.js,/index.js
   def index
      @memories = apply_scopes(Memory).page(params[:page])

      render :index, locals: { locale: @locales, query: params[:with_text], date: @date } ;end

   # GET /memories/1
   # GET /memories/1.json
   def show
      render :show, locals: { locale: @locales } ;end

   protected

   def set_locales
      @locales = %i(ру цс) ;end #TODO unfix of the ru only (will depend on the locale)

   def set_calendaries
      params[:for_calendaries] ||= 'рпц' if not params[:for_calendaries] #TODO dehardcode
      @calendaries = Calendary.by_slug( params[:for_calendaries] ).decorate ;end

   def set_calendary_cloud
      @calendary_cloud = Calendary.licit.decorate ;end

   def set_selections
      @selections = SelectionSerializer.new( @date, @calendaries )

   def set_date
      params[:with_date] ||= Date.today.strftime("%Y-%m-%d") if not params[:with_text]
      @date = params[:with_date] ;end

   def set_memory
      @memory = Memory.by_slug(params[:slug]).first&.decorate || raise(ActiveRecord::RecordNotFound) ;end;end
