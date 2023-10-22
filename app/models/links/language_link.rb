class LanguageLink < Link
   include Languageble

   has_alphabeth novalidate: true

   validates :url, uri: { allow_lost_slash: true }
   validates :language_code, inclusion: { in: Languageble.language_list }
   validates :alphabeth_code, inclusion: { in: proc { |l|
      Languageble.alphabeth_list_for( l.language_code ) } }
end
