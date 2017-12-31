class MemoriesController < ApplicationController
   before_action :set_locales, :set_date, :set_calendary_cloud
   before_action :set_memory, only: %i(show)
   before_action :default_with_date, only: %i(index)
   before_action :default_in_calendaries, only: %i(index)
   before_action :set_tokens, :set_calendary_slugs, :set_page, :set_year_date, only: %i(index)

   has_scope :with_date, only: %i(index), allow_blank: false, type: :array do |_, scope, value|
      scope.with_date(*value) ;end
   has_scope :with_tokens, only: %i(index), type: :array
   has_scope :in_calendaries, only: %i(index), type: :array

   # GET /memories,/,/index
   # GET /memories.js,/index.js
   def index
      @memories = apply_scopes(Memory).page(params[:page])

      respond_to do |format|
         format.json { render json: @memories,
                              serializer: MemoriesSerializer,
                              each_serializer: MemorySpanSerializer,
                              total: @memories.total_count,
                              page: @page,
                              year_date: @year_date,
                              calendaries: @calendary_slugs,
                              locales: @locales }
         format.html { render :index } end;end

   # GET /memories/1
   # GET /memories/1.json
   def show
      respond_to do |format|
         format.json { render :show, json: @memory, locales: @locales }
         format.html { render :show } ;end;end

   protected

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

   def default_in_calendaries
      params[:in_calendaries] ||= [ default_calendary_slug ] if is_html? and params[:in_calendaries].blank? ;end

   def default_with_date
      if is_html?
         params[:with_date] = [ @date.strftime("%d-%m-%Y"), is_julian_calendar? ] ;end;end

   def set_locales
      @locales ||= %i(ру цс) ;end #TODO unfix of the ru only (will depend on the locale)

   def set_page
      @page ||= params[:page] || 1 ;end

   def set_tokens
      @tokens ||= params[:with_tokens] || [] ;end

   def set_year_date
      @year_date ||= params['with_date']&.[](0).to_s.split(/[\-\/\.]/)[0..1].join('.') ;end

   def set_calendary_slugs
      slugs = params[:in_calendaries].present? && params[:in_calendaries] ||
              is_html? && [ default_calendary_slug ]
      @calendary_slugs ||= Slug.for_calendary.where( text: slugs ).pluck( :text ) ;end

   def set_calendary_cloud
      @calendary_cloud ||= Calendary.licit ;end

   def set_date
      # TODO add detection time zone from request
      @date ||= (
         if will_select_date_only?
            date = Time.now + church_time_gap
            is_julian_calendar? && date - julian_gap || date
         elsif params[ :with_date ].is_a?(Array)
            Time.parse( params[ :with_date ].first )
         end) ;end

   def set_memory
      @memory ||= Memory.by_slug(params[:slug]) || raise(ActiveRecord::RecordNotFound) ;end;end
