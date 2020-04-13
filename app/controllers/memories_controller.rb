class MemoriesController < ApplicationController
   before_action :default, only: %i(index), if: :is_html?
   before_action :set_locales, :set_date, :set_calendary_cloud, :set_julian
   before_action :set_memory, only: %i(show)
   before_action :set_query, :set_calendary_slugs, :set_page, only: %i(index)

   has_scope :d, only: %i(index) do |_, scope, value|
      if /(?<julian>[ню])?(?<date>[0-9\-\.]+)/ =~ value
         scope.d( date, julian != "н" )
      else
         scope ;end;end
   has_scope :q, only: %i(index)
   has_scope :c, only: %i(index)

   # NOTE https://stackoverflow.com/a/48744792/446267
   rescue_from ActionController::UnknownFormat, with: ->{ render nothing: true }

   # GET /memories,/,/index
   # GET /memories.js,/index.js
   def index
      @memories = apply_scopes(Memory).page(params[ :p ])

      respond_to do |format|
         format.json { render json: @memories,
                              serializer: MemoriesSerializer,
                              each_serializer: MemorySpanSerializer,
                              total: @memories.total_count,
                              page: @page,
                              date: @date,
                              julian: @julian,
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

   # lazy property
   def _date
      # TODO add detection time zone from request
      @_date ||= (
         date = Time.now + church_time_gap
         is_julian_calendar? && date - julian_gap || date );end

   def is_html?
      request.formats.first&.symbol == :html ;end

   def is_julian_calendar?
      params[ :d ]&.[](0) != 'н' ;end

   def church_time_gap
      9.hours ;end

   def julian_gap
      #TODO remove fixed julian gap
      13.days ;end

   def default_calendary_slugs
      #TODO make automatic detection of calendary depended on the IP and country of request
      [ 'рпц' ] ;end

   def default
      if (params[ :c ].blank? and params[ :d ].blank? and params[ :q ].blank?)
         params[ :d ] ||= "#{is_julian_calendar? && 'ю' || "н"}#{_date.strftime("%d-%m-%Y")}"
         params[ :c ] ||= default_calendary_slugs.join(",") ;end;end

   def set_locales
      @locales ||= %i(ру цс) ;end #TODO unfix of the ru only (will depend on the locale)

   def set_page
      @page ||= params[ :p ] || 1 ;end

   def set_query
      @query ||= params[ :q ] || "" ;end

   def set_date
      @date ||= (
         if /(?<julian>[ню])?(?<date>[0-9\-\.]+)/ =~ params[ :d ]
            _date ;end);end

   def set_calendary_slugs
      @calendary_slugs =
      if params[ :c ].present?
         Slug.for_calendary.where( text: params[ :c ] ).pluck( :text ) ;end;end

   def set_calendary_cloud
      @calendary_cloud ||= Calendary.licit ;end

   def set_julian
      @julian ||= is_julian_calendar? ;end

   def set_memory
      @memory ||= Memory.by_slug(params[ :slug ]) || raise(ActiveRecord::RecordNotFound) ;end;end
