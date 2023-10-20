class MemoriesController < ApplicationController
   include CoreFeatures

   before_action :set_query, :set_page, only: %i(index)
   before_action :fetch_events, only: %i(show)
   before_action :fetch_memoes, only: %i(index)

   has_scope :q, only: %i(index)

   # GET /memories,/,/index
   # GET /memories.js,/index.js
   def index
      # binding.pry
      respond_to do |format|
         format.html do
            render :index,
               locals: {
                  memoes: @memoes.jsonize(context),
                  total: @memoes.total_size,
                  cloud: @calendary_cloud.jsonize
               }
         end
         format.json do
            render plain: {
               list: @memoes.jsonize(context),
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
      # binding.pry
      respond_to do |format|
         format.html do
            render :show,
               locals: { memory: @memory.jsonize(externals: { events: @events.jsonize }),
                         cloud: @calendary_cloud.jsonize }
         end
         format.json { render json: @memory.jsonize(externals: { events: @events.jsonize }) }
      end
   end

   protected

   def is_html?
      request.formats.first&.symbol == :html
   end

   def set_page
      @page ||= params[ :p ] || 1
   end

   def set_query
      @query ||= params[ :q ] || ""
   end

   def fetch_events
      @events = @memory.events
                       .memoed
                       .with_scripta(context)
                       .with_memoes(context)
                       .with_place(context)
                       .with_titles(context)
                       .with_description(context)
   end

   def cslugs
      params['c']&.split(',')&.select {|x| x =~ Slug::RE } || []
   end

   def order
      ['_base_year', '_slug', Arel.sql("position(calendary_slugs_memoes.text::text in '#{cslugs.join(',')}')"), '_event_code']
   end

   def fetch_memoes
      @memoes = apply_scopes(Memo).with_base_year
                                  .with_slug_text
                                  .with_calendary_slug_text(context)
                                  .with_description(context)
                                  .with_title(context)
                                  .with_date
                                  .with_thumb_url
                                  .with_bond_to_title(context)
                                  .with_event_title(context)
                                  .with_orders(context)
                                  .with_event
                                  .distinct_by('_base_year', '_slug')
                                  .group(:id)
                                  .reorder(*order)
                                  .page(params[ :p ])
   end
end
