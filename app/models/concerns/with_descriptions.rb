module WithDescriptions
   extend ActiveSupport::Concern

   def self.included base
      base.class_eval do
         has_many :descriptions, -> { where(type: :Description) }, as: :describable, dependent: :delete_all do
            def for language_codes
               where(language_code: language_codes).first
            end
         end

         scope :with_descriptions, -> context do
            join_name = table.table_alias || table.name
            language_codes = [context[:locales]].flatten
            alphabeth_codes = Languageble.alphabeth_list_for(language_codes).flatten
            selector = self.select_values.dup
            if self.select_values.dup.empty?
               selector << "#{join_name}.*"
            end

            selector << "COALESCE((with __descriptions AS (
                            SELECT DISTINCT ON(descriptions.id)
                                   descriptions.id AS id,
                                   descriptions.type AS type,
                                   descriptions.text AS text,
                                   descriptions.language_code AS language_code,
                                   descriptions.alphabeth_code AS alphabeth_code,
                                   language_names.text AS language,
                                   alphabeth_names.text AS alphabeth
                              FROM descriptions
                   LEFT OUTER JOIN subjects AS languages
                                ON languages.key = descriptions.language_code
                   LEFT OUTER JOIN descriptions AS language_names
                                ON language_names.describable_id = languages.id
                               AND language_names.describable_type = 'Subject'
                               AND language_names.language_code IN ('#{language_codes.join("', '")}')
                   LEFT OUTER JOIN subjects AS alphabeths
                                ON alphabeths.key = descriptions.alphabeth_code
                   LEFT OUTER JOIN descriptions AS alphabeth_names
                                ON alphabeth_names.describable_id = alphabeths.id
                               AND alphabeth_names.describable_type = 'Subject'
                               AND alphabeth_names.alphabeth_code IN ('#{alphabeth_codes.join("', '")}')
                             WHERE descriptions.describable_id = #{join_name}.id
                               AND descriptions.describable_type = '#{model}'
                               AND descriptions.type IN ('Description', 'Title', 'Appellation', 'Tweet', 'Note')
                          GROUP BY descriptions.id, language_names.text, alphabeth_names.text)
                            SELECT jsonb_agg(__descriptions)
                              FROM __descriptions), '[]'::jsonb) AS _descriptions"

            select(selector).group(:id)
         end

         accepts_nested_attributes_for :descriptions, reject_if: :all_blank, allow_destroy: true

         validates :descriptions, associated: true
      end
   end
end
