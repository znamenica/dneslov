class Admin::LinkSerializer < ApplicationSerializer
   attributes :id, :url, :language_code, :language, :alphabeth_code, :alphabeth

   def language
     object.language_for( locales )&.text ;end

   def alphabeth
     object.alphabeth_for( locales )&.text ;end;end
