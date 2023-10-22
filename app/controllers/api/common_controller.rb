class Api::CommonController < ApplicationController
   include ::Tiun::CoreHelper
   include ::Tiun::Base

   def locales
      #TODO unfix of the ru only (will depend on the locale)
      @locales ||= %i(ру цс)
   end
end
