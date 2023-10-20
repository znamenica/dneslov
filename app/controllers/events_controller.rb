class EventsController < ApplicationController
   include CoreFeatures

   before_action :set_memory, only: %i(show)
   before_action :set_event, only: %i(show)

   has_scope :d, only: %i(index) do |_, scope, value|
      if /(?<julian>[ню])?(?<date>[0-9\-\.]+)/ =~ value
         scope.d( date, julian != "н" )
      else
         scope ;end;end
   has_scope :c, only: %i(index)

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

      # binding.pry
      @event ||= @events.by_event_code(params[:event]).first || raise(ActiveRecord::RecordNotFound)
   end
end
