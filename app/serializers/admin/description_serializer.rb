class Admin::DescriptionSerializer < ApplicationSerializer
   attributes :id, :text, :language_code, :language, :alphabeth_code, :alphabeth

   def language
     object.language_for ( locales ) ;end

   def alphabeth
     object.alphabeth_for( locales ) ;end;end
