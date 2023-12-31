class EventsController < ApplicationController
   include CoreFeatures

   before_action :set_memory, only: %i(show)
   before_action :set_event, only: %i(show)

   # GET /events/1
   # GET /events/1.json
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
                       .memoed_for(@calendary_slugs)
                       .with_memory(context)
                       .with_scripta(context)
                       .with_memoes(context)
                       .with_place(context)
                       .with_titles(context)
                       .with_description(context)
                       .with_icon(context)
                       .select("memories.base_year",
                               "memories.short_name",
                               "memories.id AS memory_id")
                       .group("memories.id",
                              "events_memories.order",
                              "events_memories.short_name") 

      @event ||= @events.by_event_code(params[:event]).first || raise(ActiveRecord::RecordNotFound)
   end
end
