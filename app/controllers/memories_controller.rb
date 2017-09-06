class MemoriesController < ApplicationController
   before_action :set_locales
   before_action :set_date, only: %i(index)
   before_action :set_calendaries, only: %i(index)
   before_action :set_calendary_cloud
   before_action :set_memory, only: %i(show)

   has_scope :with_date, only: %i(index)
   has_scope :with_text, only: %i(index)
   has_scope :in_calendaries, only: %i(index) do |_, scope, value|
      scope.in_calendaries( value.split(',') ) ;end

   # GET /memories,/,/index
   # GET /memories.js,/index.js
   def index
      @memories = apply_scopes(Memory).page(params[:page])

      render :index, locals: {
         locale: @locales,
         date: @date,
         query: params[:with_text]&.gsub( /\+\s*/, ' +' )&.split(/\s+/),
         calendaries: @calendaries } ;end

   # GET /memories/1
   # GET /memories/1.json
   def show
      render :show, locals: { locale: @locales, memory: @memory.decorate } ;end

   protected

   def is_html?
      request.formats.first.symbol == :html ;end

   def is_julian_calendar?
      params[ :calendar_style ].to_i == 0 ;end

   def will_select_date_only?
      not params[:with_text] ;end

   def set_locales
      @locales = %i(ру цс) ;end #TODO unfix of the ru only (will depend on the locale)

   def set_calendaries
      params[:in_calendaries] ||= 'рпц' if is_html? and params[:in_calendaries].blank? #TODO dehardcode
      @calendaries = Calendary.by_slug( params[:in_calendaries] ).decorate ;end

   def set_calendary_cloud
      @calendary_cloud = Calendary.licit ;end

   def set_date
      # TODO add detection time zone from request
      @date = will_select_date_only? && Time.now + 9.hours || Time.parse( params[ :with_date ])
      @date = @date - 13.days if is_julian_calendar? and will_select_date_only? #TODO remove fixed julian gap
      params[:with_date] = @date.strftime("%Y-%m-%d") ;end

   def set_memory
      @memory = Memory.by_slug(params[:slug]).first&.decorate || raise(ActiveRecord::RecordNotFound) ;end;end
