module CoreFeatures
   include ActiveSupport::Concern

   def self.included k
      k.class_eval do
         before_action :default, only: %i(index show)
         before_action :set_locales, :set_date, :set_calendary_cloud, :set_julian
         before_action :set_calendary_slugs, only: %i(index show)
         before_action :set_slug, only: %i(index show)
         before_action :set_memory, only: %i(show), if: ->(x) { @slug.sluggable_type == "Memory" }

         rescue_from Exception, with: :render_default_error
         # NOTE https://stackoverflow.com/a/48744792/446267
         rescue_from ActionController::UnknownFormat, with: ->{ render nothing: true }
         rescue_from ActiveRecord::RecordNotFound, with: -> { redirect_to :root }

         has_scope :d, only: %i(index show) do |_, scope, value|
            if /(?<julian>[ню])?(?<date>[0-9\-\.]+)/ =~ value
               scope.d( date, julian != "н" )
            else
               scope
            end
         end
         has_scope :c, only: %i(index show)
      end
   end

   def context
      @context ||= { locales: @locales, calendary_slugs: @calendary_slugs }
   end

   # lazy property
   def _date
      # TODO add detection time zone from request
      @_date ||= (
         date = Time.now + church_time_gap
         is_julian_calendar? && date - julian_gap || date )
   end

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
      ['днес','рпц']
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

   def set_date
      @date ||=
         if /(?<julian>[ню])?(?<date>[0-9\-\.]+)/ =~ params[ :d ]
            Date.parse(date)
         end
   end

   def set_calendary_slugs
      @calendary_slugs =
         if params[:c].present?
            Slug.for_calendary.where(text: params[:c].split(",") ).pluck(:text)
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

   def set_slug
      @slug =
         if params[:slug]
            Slug.where(text: params[:slug]).first || raise(ActiveRecord::RecordNotFound)
         end
   end

   def set_memory
      @memorys ||= Memory.with_scripta(context)
                         .with_names(context)
                         .with_pure_links
                         .with_slug_text

      @memory ||= @memorys.find_by_slug(@slug.text) || raise( ActiveRecord::RecordNotFound )
   end
end
