class Reading < ActiveRecord::Base
   extend TotalSize
   extend AsJson
   include Tokens
   include WithDescriptions

   enum kind: %i(custom vespers matins lithurgy dinning hours)
 
   JSON_ATTRS = {
      created_at: nil,
      updated_at: nil,
   }
   EXCEPT = %i(created_at updated_at)

   has_many :markups, -> { order(position: :asc) }
   has_many :scripta, through: :markups

   scope :with_markups, -> context do
      join_name = table.table_alias || table.name
      language_codes = [context[:locales]].flatten
      alphabeth_codes = Languageble.alphabeth_list_for(language_codes).flatten
      selector = self.select_values.dup
      if self.select_values.dup.empty?
        selector.unshift("#{join_name}.*")
      end

      selector << "COALESCE((with __markups AS (
                      SELECT DISTINCT ON(markups.id)
                             markups.id AS id,
                             markups.begin AS begin,
                             markups.end AS end,
                             markup_scripta.text AS scriptum,
                             markup_scripta.id AS scriptum_id,
                             language_names.text AS language,
                             alphabeth_names.text AS alphabeth
                        FROM markups
             LEFT OUTER JOIN scripta AS markup_scripta
                          ON markup_scripta.id = markups.scriptum_id
             LEFT OUTER JOIN subjects AS languages
                          ON languages.key = markup_scripta.language_code
             LEFT OUTER JOIN descriptions AS language_names
                          ON language_names.describable_id = languages.id
                         AND language_names.describable_type = 'Subject'
                         AND language_names.language_code IN ('#{language_codes.join("', '")}')
             LEFT OUTER JOIN subjects AS alphabeths
                          ON alphabeths.key = markup_scripta.alphabeth_code
             LEFT OUTER JOIN descriptions AS alphabeth_names
                          ON alphabeth_names.describable_id = alphabeths.id
                         AND alphabeth_names.describable_type = 'Subject'
                         AND alphabeth_names.alphabeth_code IN ('#{alphabeth_codes.join("', '")}')
                    GROUP BY markups.id, markup_scripta.id, markup_scripta.text, language_names.text, alphabeth_names.text)
                      SELECT jsonb_agg(__markups)
                        FROM __markups), '[]'::jsonb) AS _markups"

      select(selector).group(:id)
   end

   accepts_nested_attributes_for :markups, reject_if: :all_blank, allow_destroy: true

   validates :markups, associated: true
end
