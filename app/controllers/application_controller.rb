class ApplicationController < ActionController::Base
   # Prevent CSRF attacks by raising an exception.
   # For APIs, you may want to use :null_session instead.
   protect_from_forgery with: :exception

   def update_session *hashes
      session.update(hashes.reduce { |res, hash| res.merge(hash) })
   end

   def render_not_exist_error e
      render_error(e, 404)
   end

   def render_default_error e
      render_error(e, 500)
   end

   def render_error e, code
      error_text = "[#{e.class}]: #{e.message}\n\t#{e.backtrace.join("\n\t")}"
      logger.error(error_text)
      error = {
         code: code,
         klass: e.class,
         message: t(e.class.to_s.split("::").map(&:downcase).join(".")) +
            (e.class.to_s != e.message ? e.message : ""),
         backtrace: e.backtrace,
      }

      respond_to do |format|
         format.html { render action_name, status: code, locals: { error: error }}
         format.json { render json: error, status: code }
      end
   end
end
