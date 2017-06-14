class MemoriesController < ApplicationController
  before_action :set_memory, only: %i(show)

  has_scope :by_date, only: %i(index)
  has_scope :by_text, only: %i(index)

  # GET /memories
  # GET /memories.json
  def index
    @memories = apply_scopes(Memory).all
  end

  # GET /memories/1
  # GET /memories/1.json
  def show
  end

  protected

  # Use callbacks to share common setup or constraints between actions.
  def set_memory
    @memory = Memory.by_slug(params[:slug]).first || raise(ActiveRecord::NotFound) ;end;end
