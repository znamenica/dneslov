class LanguageLink < Link
   validates :language_code, inclusion: { in: Languageble.language_list }
   validates :alphabeth_code, inclusion: { in: proc { |l|
      Languageble.alphabeth_list_for( l.language_code ) } } ; end
