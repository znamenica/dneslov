module WithLinks
   extend ActiveSupport::Concern

   def self.included base
      base.class_eval do
         has_many :links, as: :info, dependent: :destroy

         scope :with_links, -> context do
            join_name = table.table_alias || table.name
            language_codes = [context[:locales]].flatten
            alphabeth_codes = Languageble.alphabeth_list_for(language_codes).flatten
            selector = self.select_values.dup
            if self.select_values.dup.empty?
               selector << "#{join_name}.*"
            end

            selector << "COALESCE((with __links as (
                            SELECT DISTINCT ON(links.id)
                                   links.id as id,
                                   links.type as type,
                                   links.url as url,
                                   links.language_code AS language_code,
                                   links.alphabeth_code AS alphabeth_code,
                                   language_names.text AS language,
                                   alphabeth_names.text AS alphabeth
                              FROM links
                   LEFT OUTER JOIN subjects AS languages
                                ON languages.key = links.language_code
                   LEFT OUTER JOIN descriptions AS language_names
                                ON language_names.describable_id = languages.id
                               AND language_names.describable_type = 'Subject'
                               AND language_names.language_code IN ('#{language_codes.join("', '")}')
                   LEFT OUTER JOIN subjects AS alphabeths
                                ON alphabeths.key = links.alphabeth_code
                   LEFT OUTER JOIN descriptions AS alphabeth_names
                                ON alphabeth_names.describable_id = alphabeths.id
                               AND alphabeth_names.describable_type = 'Subject'
                               AND alphabeth_names.alphabeth_code IN ('#{alphabeth_codes.join("', '")}')
                             WHERE links.info_id = #{join_name}.id
                               AND links.info_type = '#{model}'
                          GROUP BY links.id, language_names.text, alphabeth_names.text)
                            SELECT jsonb_agg(__links)
                              FROM __links), '[]'::jsonb) AS _links"

            select(selector).group(:id)
         end

         scope :with_pure_links, -> do
            selector = "COALESCE((SELECT jsonb_agg(links)
                                    FROM links
                                   WHERE links.info_id = #{join_name}.id
                                     AND links.info_type = '#{model}'), '[]'::jsonb) AS _links"

            select(selector).group(:id)
         end

         accepts_nested_attributes_for :links, reject_if: :all_blank, allow_destroy: true

         validates :links, associated: true
      end
   end
end
