class ImagesController < ApplicationController
   rescue_from Exception, with: :render_default_error
   # NOTE https://stackoverflow.com/a/48744792/446267
   rescue_from ActionController::UnknownFormat, with: ->{ render nothing: true }
   rescue_from ActiveRecord::RecordNotFound, with: -> { redirect_to :root }
   rescue_from Errno::ENOENT, with: :render_not_exist_error

   # GET /memories/:letter/:short_name/:image
   def cache
      redis_connection.write(["SET", uri, IO.binread(path)])
      redis_connection.read # NOTE required for syncing redis write operation

      send_file(path, type: 'image/webp', disposition: 'inline')
   end

   protected

   def redis_connection
      return @redis_connection if @redis_connection

      r = Rails.application.config.cache_store[1]
      @redis_connection = Hiredis::Connection.new
      @redis_connection.connect(r[:host], r[:port])

      @redis_connection
   end

   def path
      return @path if @path

      root = ENV['STORE_IMAGE_PATH'] || Rails.root.join('images')

      @path = File.join(root, *image_link.url.split('/')[2..-1])
   end

   def uri
      @uri ||= '/images/' + params[:path]
   end

   def image_link
      @image_link ||= Link.find_by_url!(uri)
   end
end
