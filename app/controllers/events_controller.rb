class EventsController < ApplicationController
   before_action :default, only: %i(show)
   before_action :set_locales, :set_date, :set_calendary_cloud, :set_julian
   before_action :set_memory, only: %i(show)
   before_action :set_calendary_slugs, only: %i(show)
   before_action :set_event, only: %i(show)

   has_scope :d, only: %i(index) do |_, scope, value|
      if /(?<julian>[ню])?(?<date>[0-9\-\.]+)/ =~ value
         scope.d( date, julian != "н" )
      else
         scope ;end;end
   has_scope :c, only: %i(index)

   rescue_from Exception, with: :render_default_error
   # NOTE https://stackoverflow.com/a/48744792/446267
   rescue_from ActionController::UnknownFormat, with: ->{ render nothing: true }
   rescue_from ActiveRecord::RecordNotFound, with: -> { redirect_to :root }

   # GET /memories/1
   # GET /memories/1.json
   def show
      respond_to do |format|
         format.html do
            render :show,
               locals: { event: @event.jsonize,
                         cloud: @calendary_cloud.jsonize }
         end
         format.json { render json: @event.jsonize }
      end
   end

   protected

   def context
      @context ||= { locales: @locales }
   end

   # lazy property
   def _date
      # TODO add detection time zone from request
      @_date ||= (
         date = Time.now + church_time_gap
         is_julian_calendar? && date - julian_gap || date )
   end

#   def is_html?
#      request.formats.first&.symbol == :html
#   end
#
   def is_julian_calendar?
      params[ :d ]&.[](0) != 'н'
   end

   def church_time_gap
      9.hours
   end

   def julian_gap
      #TODO remove fixed julian gap
      13.days
   end

   def default_calendary_slugs
      #TODO make automatic detection of calendary depended on the IP and country of request
      [ 'рпц' ]
   end

   def default
      if !(params[ :c ] || params[ :d ] || params[ :q ])
         params[ :d ] ||= "#{is_julian_calendar? && 'ю' || "н"}#{_date.strftime("%d-%m-%Y")}"
         params[ :c ] ||= default_calendary_slugs.join(",")
      end
   end

   def set_locales
      #TODO unfix of the ru only (will depend on the locale)
      @locales ||= %i(ру цс)
   end

#   def set_page
#      @page ||= params[ :p ] || 1
#   end
#
#   def set_query
#      @query ||= params[ :q ] || ""
#   end

   def set_date
      @date ||=
         if /(?<julian>[ню])?(?<date>[0-9\-\.]+)/ =~ params[ :d ]
            Date.parse(date)
         end
   end

   def set_calendary_slugs
      @calendary_slugs =
      if params[ :c ].present?
         Slug.for_calendary.where( text: params[ :c ].split(",") ).pluck( :text )
      end
   end

   def set_calendary_cloud
      @calendary_cloud ||=
         Calendary.licit_with(params[ :c ])
                  .with_title(@locales)
                  .with_description(@locales)
                  .with_url
                  .with_slug_text
                  .group("calendaries.id")
                  .distinct_by('_slug')
   end

   def set_julian
      @julian ||= is_julian_calendar?
   end

   def set_memory
      @memorys ||= Memory.with_scripta(context[:locales])
                         .with_names(context)
                         .with_pure_links
                         .with_slug_text


      @memory ||= @memorys.find_by_slug(params[:slug]) || raise( ActiveRecord::RecordNotFound )
   end

   def set_event
      @events = @memory.events
                       .memoed
                       .with_memory(context)
                       .with_scripta(context)
                       .with_memoes(context)
                       .with_place(context)
                       .with_titles(context)
                       .with_description(context)
                       .select("memories.base_year",
                               "memories.short_name",
                               "memories.id AS memory_id")
                       .group("memories.id",
                              "events_memories.order",
                              "events_memories.short_name") 

      @event ||= @events.by_event_code(params[:event]).first || raise(ActiveRecord::RecordNotFound)
   end
end
