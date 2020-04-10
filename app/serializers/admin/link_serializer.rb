class Admin::LinkSerializer < ApplicationSerializer
   attributes :id, :url, :language_code, :language, :alphabeth_code, :alphabeth

   def language
     object.language_for ( locales ) ;end

   def alphabeth
     object.alphabeth_for( locales ) ;end;end
