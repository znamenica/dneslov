module WithLocaleNames
   extend ActiveSupport::Concern

   def self.included base
      base.class_eval do
         scope :with_locale_names, -> context do
            join_name = table.table_alias || table.name
            language_codes = [ context[:locales] ].flatten
            alphabeth_codes = Languageble.alphabeth_list_for( language_codes ).flatten
            selector = self.select_values.dup
            if self.select_values.dup.empty?
               selector << "#{join_name}.*"
            end
            selector.concat [ "language_names.text AS _language", "alphabeth_names.text AS _alphabeth" ]

            join = "LEFT OUTER JOIN subjects AS languages
                                 ON languages.key = #{join_name}.language_code
                    LEFT OUTER JOIN descriptions AS language_names
                                 ON language_names.describable_id = languages.id
                                AND language_names.describable_type = 'Subject'
                                AND language_names.language_code IN ('#{language_codes.join("', '")}')
                    LEFT OUTER JOIN subjects AS alphabeths
                                 ON alphabeths.key = #{join_name}.alphabeth_code
                    LEFT OUTER JOIN descriptions AS alphabeth_names
                                 ON alphabeth_names.describable_id = alphabeths.id
                                AND alphabeth_names.describable_type = 'Subject'
                                AND alphabeth_names.alphabeth_code IN ('#{alphabeth_codes.join("', '")}')"

            joins(join).select(selector.uniq).group(:id, 'language_names.text', 'alphabeth_names.text')
         end
      end
   end
end
