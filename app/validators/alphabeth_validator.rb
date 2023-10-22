class AlphabethValidator < ActiveModel::EachValidator
   def plain_options
      [ options[:with], options[:in] ].flatten.compact.map do |o|
         case o
         when Hash
            o.map { |(k, v)| { k => v } }
         when String, Symbol
            { o => true }
         when Array
            o.map { |x| { x => true } }
         else
            raise "Target of kind #{o.class} is unsupported"
         end
      end.flatten.map { |x| [ x.keys.first, x.values.first ] }.to_h
   end

   def validate_each(record, attribute, value)
      o = plain_options
      code = record.alphabeth_code.to_s.to_sym
      res = Languageble::MATCH_TABLE[ code ]
      if res
         if ! o.keys.include?( :nosyntax )
            res += Languageble::SYNTAX_TABLE[ code ]
         end

         if o.keys.include?( :allow )
            res += o[ :allow ]
         end

         res += '\<\>'
      end

      if res && value.present? && value !~ ( re = /^[#{res}]+$/ )
         invalid_is = []
         chars = value.unpack("U*").map.with_index do |c, i|
            begin
               re !~ [ c ].pack("U") && c || nil
            rescue Encoding::CompatibilityError
               invalid_is << i
               nil
            end
         end.compact.uniq.sort.pack( "U*" )

         if chars.present?
            record.errors.add(attribute, :invalid_language_char,
               message: I18n.t('activerecord.errors.invalid_language_char', alphabeth: record.alphabeth_code, chars: chars))
         end

         if invalid_is.any?
            parts = invalid_is.map { |i| value[ i - 2..i + 2 ] }
            record.errors.add(attribute, :invalid_language_char,
               message: I18n.t( 'activerecord.errors.invalid_utf8_char', alphabeth: record.alphabeth_code,
               parts: '"' + parts.join('", "') + '"'))
         end
      end
   end
end
