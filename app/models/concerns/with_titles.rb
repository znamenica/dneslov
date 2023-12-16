module WithTitles
   extend ActiveSupport::Concern

   def self.included base
      base.class_eval do
         has_many :titles, -> { title }, as: :describable, class_name: :Title
         has_many :default_titles, -> { distinct }, through: :kind, source: :names, class_name: :Appellation
         has_many :all_titles, ->(this) do
            where( describable_type: model.name, describable_id: this.id, kind: "Title" )
              .or( Appellation.merge(this.kind.names) )
           .order( :describable_type )
         end, primary_key: nil, class_name: :Description

         scope :by_title, -> title do
            joins(:titles).where(titles: { text: title })
         end

         scope :with_titles, -> context do
            as = table.table_alias || table.name
            language_codes = [ context[:locales] ].flatten
            alphabeth_codes = Languageble.alphabeth_list_for( language_codes ).flatten
            selector = self.select_values.dup
            if selector.empty?
               selector << "#{model.table_name}.*"
            end
            binding.pry

            if self.attributes.include?(:kind_code)
               kind_join = 
                  "LEFT OUTER JOIN subjects AS #{as}_kinds
                                ON #{as}_kinds.kind_code = '#{model.name}Kind'
                               AND #{as}_kinds.key = #{as}.kind_code"
               kind_where = 
                               "OR titles.describable_id = #{as}_kinds.id
                               AND titles.describable_type = 'Subject'
                               AND titles.type = 'Appellation')
                               AND titles.language_code IN ('#{language_codes.join("', '")}')"
            end

            selector << "COALESCE((WITH __titles AS (
                            SELECT DISTINCT ON(titles.id)
                                   titles.id AS id,
                                   titles.describable_type AS type,
                                   titles.text AS text,
                                   titles.language_code AS language_code,
                                   titles.alphabeth_code AS alphabeth_code,
                                   language_names.text AS language,
                                   alphabeth_names.text AS alphabeth
                              FROM descriptions AS titles
                                   #{kind_join}
                   LEFT OUTER JOIN subjects AS languages
                                ON languages.key = titles.language_code
                   LEFT OUTER JOIN descriptions AS language_names
                                ON language_names.describable_id = languages.id
                               AND language_names.describable_type = 'Subject'
                               AND language_names.language_code IN ('#{language_codes.join("', '")}')
                   LEFT OUTER JOIN subjects AS alphabeths
                                ON alphabeths.key = titles.alphabeth_code
                   LEFT OUTER JOIN descriptions AS alphabeth_names
                                ON alphabeth_names.describable_id = alphabeths.id
                               AND alphabeth_names.describable_type = 'Subject'
                               AND alphabeth_names.alphabeth_code IN ('#{alphabeth_codes.join("', '")}')
                             WHERE titles.id IS NOT NULL
                               AND (titles.describable_id = #{as}.id
                               AND titles.describable_type = '#{model}'
                               AND titles.type = IN ('Title', 'Appellation')
                                   #{kind_where}
                          GROUP BY titles.id, titles.describable_type, titles.text,
                                   language_names.text, alphabeth_names.text)
                            SELECT jsonb_agg(__titles)
                              FROM __titles), '[]'::jsonb) AS _titles"

            # binding.pry
            select(selector).group(:id)
         end

         scope :with_title, -> context do
            join_name = table.table_alias || table.name
            language_codes = [context[:locales]].flatten

            selector = self.select_values.dup
            if selector.empty?
               selector << "#{join_name}.*"
            end
            selector << 'first_descriptions.text AS _description'

            join = "LEFT OUTER JOIN descriptions AS first_descriptions ON first_descriptions.describable_id = #{join_name}.id
                                AND first_descriptions.describable_type = '#{model}'
                                AND first_descriptions.type IN ('Description', 'Note')
                                AND first_descriptions.language_code IN ('#{language_codes.join("', '")}')"

            joins(join).select(selector.uniq).group('_description', "#{join_name}.id")
         end

         accepts_nested_attributes_for :titles, reject_if: :all_blank, allow_destroy: true

         validates :titles, associated: true
      end
   end
end
