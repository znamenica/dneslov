class MemoriesController < ApplicationController
   before_action :default_with_date, only: %i(index)
   before_action :default_in_calendaries, only: %i(index)
   # before_action :set_calendary_cloud
   # before_action :set_memory, only: %i(show)

   has_scope :with_date, only: %i(index), allow_blank: false
   has_scope :with_tokens, only: %i(index), type: :array
   has_scope :in_calendaries, only: %i(index), type: :array

   # GET /memories,/,/index
   # GET /memories.js,/index.js
   def index
      @memories = apply_scopes(Memory).page(params[:page])
      binding.pry

      render :index, locals: {
         locales: locales,
         date: date,
         query: query,
         calendary_cloud: calendary_cloud,
         calendary_slugs: calendary_slugs } ;end

   # GET /memories/1
   # GET /memories/1.json
   def show
      render :show, locals: { locale: locales, memory: memory.decorate } ;end

   protected

   def query
      ( params[:with_tokens] || [] ).join( ' ' ).gsub( /\+\s*/, ' +' ).split(/\s+/) ;end

   def is_html?
      request.formats.first.symbol == :html ;end

   def is_julian_calendar?
      params[ :calendar_style ].to_i == 0 ;end

   def will_select_date_only?
      params[:with_text].blank? ;end

   def church_time_gap
      9.hours ;end

   def julian_gap
      #TODO remove fixed julian gap
      13.days ;end

   def default_calendary_slug
      #TODO make automatic detection of calendary depended on the IP and country of request
      'рпц' ;end

   def locales
      @locales ||= %i(ру цс) ;end #TODO unfix of the ru only (will depend on the locale)

   def default_in_calendaries
      params[:in_calendaries] ||= [ default_calendary_slug ] if is_html? and params[:in_calendaries].blank? ;end

   def default_with_date
      if is_html?
         params[:with_date] = date.strftime("%Y-%m-%d") ;end;end

   def calendary_slugs
      @calendary_slugs ||= Slug.for_calendary.where( text: params[:in_calendaries] ).pluck( :text ) ;end

   def calendary_cloud
      @calendary_cloud ||= Calendary.licit ;end

   def date
      # TODO add detection time zone from request
      @date ||= (
         if will_select_date_only?
            date = Time.now + church_time_gap
            is_julian_calendar? && date - julian_gap || date
         elsif params[ :with_date ].present?
            Time.parse( params[ :with_date ] )
         end) ;end

   def memory
      @memory ||= Memory.by_slug(params[:slug]).first&.decorate || raise(ActiveRecord::RecordNotFound) ;end;end
