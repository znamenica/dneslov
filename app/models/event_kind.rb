class EventKind < ActiveRecord::Base
   include Languageble

   has_many :events, foreign_key: :type, primary_key: :kind
 
   has_alphabeth on: { text: [ :nosyntax, allow: " ‑" ] }

   validates :kind, :text, :language_code, presence: true ;end
