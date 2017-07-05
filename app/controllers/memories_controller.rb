class MemoriesController < ApplicationController
   before_action :set_memory, only: %i(show)
   before_action :set_date, only: %i(index)

   has_scope :with_date, only: %i(index)
   has_scope :with_text, only: %i(index)

   # GET /memories,/,/index
   # GET /memories.js,/index.js
   def index
      @memories = apply_scopes(Memory).page(params[:page])

      render :index, locals: { locale: %i(ру цс), query: params[:with_text] } ;end

   # GET /memories/1
   # GET /memories/1.json
   def show
      render :show, locals: { locale: %i(ру цс) } ;end

   protected

   def set_date
      @date = params[:with_date] || Date.today ;end

   def set_memory
      @memory = Memory.by_slug(params[:slug]).first&.decorate || raise(ActiveRecord::RecordNotFound) ;end;end
