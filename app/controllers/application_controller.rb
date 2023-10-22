class ApplicationController < ActionController::Base
   # Prevent CSRF attacks by raising an exception.
   # For APIs, you may want to use :null_session instead.
   protect_from_forgery with: :exception

   def update_session *hashes
      session.update(hashes.reduce { |res, hash| res.merge(hash) })
   end

   def render_not_exist_error e
      error = "[#{e.class}]: #{e.message}\n\t#{e.backtrace.join("\n\t")}"
      logger.error(error)
      render :index, locals: { error: error, status: 404 }
   end

   def render_default_error e
      error = "[#{e.class}]: #{e.message}\n\t#{e.backtrace.join("\n\t")}"
      logger.error(error)
      render :index, locals: { error: error, status: 500 }
   end
end
