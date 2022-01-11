module Languageble
   extend ActiveSupport::Concern

   def self.included base
      base.extend(ClassMethods)

      base.class_eval do
         validates :language_code, inclusion: { in: Languageble.language_list }
         validates :alphabeth_code, inclusion: { in: proc { |l| Languageble.alphabeth_list_for(l.language_code)}}
      end
   end

   # :nodoc:
   LANGUAGE_TREE = {
      ру: %i(РП РУ),
      др: %i(ДР),
      цс: %i(ЦС РП РУ ЦР),
      сс: %i(СС ЦР),
      мс: %i(МСК МСЛ КМСК КМСЛ),
      сц: :СЦ,
      ук: :УК,
      бл: :БЛ,
      мк: :МК,
      сх: %i(СР ХР),
      со: :СО,
      бг: :БГ,
      чх: :ЧХ,
      сл: :СЛ,
      по: :ПО,
      кш: :КШ,
      вл: :ВЛ,
      нл: :НЛ,
      ар: :АР,
      ив: :ИВ,
      рм: %i(РМ ЦУ ЦР),
      гр: :ГР,
      сг: :СГ,
      дг: :ДГ,
      ла: :ЛА,
      ит: :ИТ,
      фр: :ФР,
      ис: :ИС,
      не: :НЕ,
      ир: :ИР,
      си: :СИ,
      аб: :АБ,
      но: :НО,
      да: :ДА,
      ан: %i(АН АМ),
      са: %i(СА),
      ра: %i(РА),
      ев: :ЕВ,
      шв: :ШВ,
      ил: :ИЛ,
      фа: :ФА,
      нз: :НЗ,
      пг: :ПГ,
      го: :ГО,
      ко: :КО,
      фи: :ФИ,
      ес: :ЕС,
      лт: :ЛТ,
      ли: :ЛИ,
      вн: :ВН,
      нн: :НН,
      аа: :АА,
   }

   # :nodoc:
   OPTIONS = %i(novalidate on)

   # +language_list+ returns list of available languages.
   #
   # Example:
   #
   #     validates :language_code, inclusion: { in: Languageble.language_list }
   #
   def self.language_list
      list = Languageble::LANGUAGE_TREE.keys
      list.concat( list.map( &:to_s ) ) ;end

   # +alphabeth_list+ returns list of available languages.
   #
   def self.alphabeth_list
      Languageble::LANGUAGE_TREE.values.flatten.uniq ;end

   # +alphabeth_list_for+ returns list of available alphabeths for the specified
   # list of language codes as a string or and array.
   #
   # Example:
   #
   #     validates :alphabeth_code, inclusion: { in: proc { |l|
   #        Languageble.alphabeth_list_for( l.language_code ) } } ; end
   #
   def self.alphabeth_list_for language_codes
      [ language_codes ].flatten.map do |language_code|
         Languageble::LANGUAGE_TREE[ language_code.to_s.to_sym ]
         end.flatten.uniq.map( &:to_s ) ;end

   # +language_list_for+ returns the language list for the specified alphabeth
   # code.
   #
   # Example:
   #
   #     validates :language_code, inclusion: { in: proc { |l|
   #        Languageble.language_list_for( l.alphabeth_code ) } } ; end
   #
   def self.language_list_for alphabeth_code
      language_codes =
      Languageble::LANGUAGE_TREE.invert.map do |(alphs, lang)|
         [ alphs ].flatten.map do |a|
            [a, lang] ;end;end
      .flatten(1).reduce({}) do |h, (alph, lang)|
         case h[alph]
         when NilClass
            h[alph] = lang
         when Array
            h[alph] << lang
         else
            h[alph] = [ h[alph], lang ] ;end
         h ;end
      .[](alphabeth_code.to_sym)

      [ language_codes ].flatten.compact.map( &:to_s ) ;end

   module ClassMethods
      def self.extended base
         base.has_one :language, primary_key: :language_code, foreign_key: :key, class_name: :Subject
         base.has_one :alphabeth, primary_key: :alphabeth_code, foreign_key: :key, class_name: :Subject; end

      # +has_alphabeth+ sets up alphabeth feature on a column or itself model,
      # i.e. generally +alphabeth_code+, and +language_code+ fields to match text
      # of the specified columns if any.
      #
      # Examples:
      #
      #     has_alphabeth on: name: true
      #     has_alphabeth on: { text: [:nosyntax, allow: " ‑" ] }
      #     has_alphabeth on: [ :name, :text ]
      #     has_alphabeth novalidate: true
      #
      def has_alphabeth options = {}
         OPTIONS.each do |o|
            self.send( "setup_#{o}", options[ o ] ) ;end ;end

      protected

      # +setup_on+ accepts options :on for validation on a specified field
      #
      # Examples:
      #
      #     has_alphabeth on: name: true
      #     has_alphabeth on: { text: [:nosyntax, allow: " ‑" ] }
      #     has_alphabeth on: [ :name, :text ]
      #
      def setup_on option_on
         on = [ option_on ].map do |o|
            case o
            when Hash
               o.map { |(k, v)| { k => v } }
            when String, Symbol
               { o => true }
            when Array
               o.map { |x| { x => true } }
            when NilClass
               []
            else
               raise "Target of kind #{o.class} is unsupported" ;end ;end
            .flatten.map { |x| [ x.keys.first, x.values.first ] }.to_h

         on.each do |target, options|
            self.class_eval <<-RUBY
               validates :#{target}, alphabeth: #{options.inspect}
            RUBY
            end ;end

      # +setup_novalidate+ accepts boolean option :novalidate to skip validation on
      # +:language_code+, and +:alphabeth_code+ fields.
      #
      # Examples:
      #
      #     has_alphabeth novalidate: true
      #
      def setup_novalidate novalidate
         if ! novalidate
            self.class_eval <<-RUBY
               validates :language_code, inclusion:
                  { in: Languageble.language_list }
               validates :alphabeth_code, inclusion:
                  { in: proc { |l|
                     Languageble.alphabeth_list_for( l.language_code ) } }
               RUBY
         end ;end;end

   def language_for locales
      language&.names&.for( locales ) ;end

   def alphabeth_for locales
      alphabeth&.names&.for( locales ) ;end;end
