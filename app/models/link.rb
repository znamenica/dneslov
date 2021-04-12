class Link < ActiveRecord::Base
   include Languageble

   has_alphabeth novalidate: true

   validates :type, :info_type, presence: true ; end
