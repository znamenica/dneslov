class MemoriesController < ApplicationController
   before_action :default, only: %i(index show)
   before_action :set_locales, :set_date, :set_calendary_cloud, :set_julian
   before_action :set_memory, only: %i(show)
   before_action :set_query, :set_page, only: %i(index)
   before_action :set_calendary_slugs, only: %i(index show)
   before_action :fetch_events, only: %i(show)
   before_action :fetch_memoes, only: %i(index)

   has_scope :d, only: %i(index) do |_, scope, value|
      if /(?<julian>[ню])?(?<date>[0-9\-\.]+)/ =~ value
         scope.d( date, julian != "н" )
      else
         scope ;end;end
   has_scope :q, only: %i(index)
   has_scope :c, only: %i(index)

   rescue_from Exception, with: :render_default_error
   # NOTE https://stackoverflow.com/a/48744792/446267
   rescue_from ActionController::UnknownFormat, with: ->{ render nothing: true }
   rescue_from ActiveRecord::RecordNotFound, with: -> { redirect_to :root }

   # GET /memories,/,/index
   # GET /memories.js,/index.js
   def index
      respond_to do |format|
         format.html do
            render :index,
               locals: {
                  memoes: @memoes.as_json(context),
                  total: @memoes.total_size,
                  cloud: @calendary_cloud.as_json
               }
         end
         format.json do
            render plain: {
               list: @memoes,
               page: @page,
               total: @memoes.total_size
            }.to_json(context)
         end
      end
   end

   # GET /memories/1
   # GET /memories/1.json
   def show
      #Benchmark.bm( 20 ) do |bm|
      #   bm.report( "Access JSON:" ) do
      #   end
      #end
      respond_to do |format|
         format.html do
            render :show,
               locals: { memory: @memory.as_json(externals: { events: @events }),
                         cloud: @calendary_cloud.as_json }
         end
         format.json { render plain: @memory.to_json(externals: { events: @events }) }
      end
   end

   protected

   def context
      @context ||= { locales: @locales } ;end

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
      if !(params[ :c ] || params[ :d ] || params[ :q ])
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
            Date.parse(date) ;end);end

   def set_calendary_slugs
      @calendary_slugs =
      if params[ :c ].present?
         Slug.for_calendary.where( text: params[ :c ].split(",") ).pluck( :text ) ;end;end

   def set_calendary_cloud
      @calendary_cloud ||=
         Calendary.licit_with(params[ :c ])
                  .with_title(@locales)
                  .with_description(@locales)
                  .with_url
                  .with_slug_text
                  .group("calendaries.id")
                  .uniq ;end

   def set_julian
      @julian ||= is_julian_calendar? ;end

   def set_memory
      @memorys ||= Memory.by_slug(params[ :slug ])
                        .with_cantoes( @locales )
                        .with_names( @locales )
                        .with_pure_links
                        .with_slug_text

      @memory ||= @memorys.first || raise( ActiveRecord::RecordNotFound )
   end

   def fetch_events
      @events = @memory.events
                       .memoed
                       .with_cantoes(context[:locales])
                       .with_memoes(context[:locales])
                       .with_place(context[:locales])
                       .with_titles(context)
                       .with_description(context)
   end

   def fetch_memoes
      @memoes = apply_scopes(Memo).with_base_year
                                  .with_slug_text
                                  .with_calendary_slug_text
                                  .with_description(@locales)
                                  .with_title(@locales)
                                  .with_date
                                  .with_thumb_url
                                  .with_bond_to_title(@locales)
                                  .with_event_title(@locales)
                                  .with_orders(@locales)
                                  .with_event
                                  .distinct_by('_base_year', '_slug')
                                  .group(:id)
                                  .page(params[ :p ])
   end
end
