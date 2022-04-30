class Admin::CommonController < ApplicationController
   include Concerns::Auth
   include Pundit

   before_action :authenticate_user!, except: %i(dashboard)
   before_action :validate_session
   before_action :set_query, only: %i(index)
   before_action :set_page, only: %i(index)
   before_action :set_locales
   before_action :new_object, only: %i(create)
   before_action :fetch_object, only: %i(show update destroy)
   before_action :fetch_objects, only: %i(all index)
   before_action :authorize!, except: %i(dashboard)
   layout 'admin'

   rescue_from ActiveRecord::RecordNotUnique,
               ActiveRecord::RecordInvalid,
               ActiveRecord::RecordNotSaved,
               ActiveRecord::RecordNotFound,
               StandardError, with: :unprocessable_entity

   has_scope :t, only: %i(index all)
   has_scope :q, only: %i(index)

   def all
      # binding.pry
      respond_to do |format|
         format.json do
            render :index,
               plain: {
                     total: @objects.total_size,
                     list: @objects.limit(500).jsonify(only: %i(key value)),
                  }.to_json
         end
      end
   end

   # GET /<objects>/
   def index
      # binding.pry
      respond_to do |format|
         format.json do
            render plain: {
               list: @objects.jsonify(context),
               page: @page,
               total: @objects.total_size
            }.to_json
         end
         format.html { render :index }
      end
   end

   # POST /<objects>/create
   def create
      @object.save!

      #TODO: render json: @object.jsonize(context)
      render json: prepare_object(@object.reload).jsonify(context)
   end

   # PUT /<objects>/1
   def update
      @object.update!(permitted_params)

      # binding.pry
      #TODO: render json: @object.jsonize(context)
      render json: prepare_object(@object.reload).jsonify(context)
   end

   # GET /<objects>/1
   def show
      respond_to do |format|
         format.json { render :show, json: @object.jsonify(context) }
      end
   end

   # DELETE /<objects>/1
   def destroy
      @object.destroy!

      respond_to do |format|
         format.json { render :show, json: @object.dejsonify(context) }
      end
   end

   def dashboard
   end

   protected

   def short_with_list
      %w(with_key with_value)
   end

   def index_with_list
      []
   end

   def with_list
      send({
         "all" => :short_with_list,
         "index" => :index_with_list,
         "create" => :index_with_list,
         "update" => :index_with_list,
         "show" => :index_with_list,
         "destroy" => :index_with_list,
      }[action_name])
   end

   # TODO SQLize
   def desc record
      record._names.find {|d| @locales.include?(d["language_code"].to_sym) }&.fetch("text", "")
   end

   def context
      @context ||= { locales: @locales }
   end

   def model
     self.class.to_s.gsub(/.*::/, "").gsub("Controller", "").singularize.constantize
   end

   def validate_session
      if session_lost?
         drop_session
      end
   end

   def authorize!
      policy = Object.const_get(model.name + "Policy")
      if !policy.new(current_user, @object).send(action_name + '?')
         raise Pundit::NotAuthorizedError, "not allowed to do #{action_name} this #{@object.inspect}"
      end
   end

   def unprocessable_entity e
      Rails.logger.error("#{e.class}: #{e.message}\n\t#{e.backtrace.join("\n\t")}")

      errors = @object && @object.errors.any? && @object.errors.messages || { nil => e.to_s }
      render json: errors, status: :unprocessable_entity
   end

   def set_page
      @page ||= (params[ :p ] || 1).to_i
   end

   def set_locales
      #TODO unfix of the ru only (will depend on the locale)
      @locales ||= %i(ру цс)
   end

   def set_query
      @query ||= params[ :q ] || ""
   end

   def new_object
      @object = model.new( permitted_params )
   end

   def context
      { locales: @locales }
   end

   def include_list
      [] ;end

   def issue_with query, with_method
      query.send( with_method, context )
   rescue ArgumentError
      query.send( with_method )
   end

   def prepare_object object
      prepare_objects.where(id: object.id).first
   end

   def prepare_pure_objects
      pre = include_list.reduce( apply_scopes( model )) { |q, i| q.includes( i ) }
   end

   def prepare_objects
      pre = include_list.reduce( apply_scopes( model )) { |q, i| q.includes( i ) }

      with_list.reduce( pre ) { |q, with_method| issue_with( q, with_method )}
   end

   def fetch_objects
      @objects = prepare_objects.page( params[ :p ])
   end

   def fetch_object
      if params[:slug]
         @object ||= prepare_objects.find_by_slug(params[:slug])
      else
         @object ||= prepare_objects.find_by_pk(params[:id])
      end || raise(ActiveRecord::RecordNotFound)
   end
end
