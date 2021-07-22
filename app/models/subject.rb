class Subject < ActiveRecord::Base
   extend TotalSize
   include AsJson

   JSON_SCHEMA = Rails.root.join('config', 'schemas', 'subject.json').to_s

   attr_defaults meta: "{}"

   belongs_to :kind, primary_key: :key, foreign_key: :kind_code, class_name: :Subject

   has_many :names, as: :describable, dependent: :delete_all, class_name: :Appellation do
      def for language_codes
         where( language_code: language_codes ).first ;end;end

   has_many :descriptions, -> { where( type: :Description ) }, as: :describable, dependent: :delete_all do
      def for language_codes
         where( language_code: language_codes ).first ;end;end

   scope :by_token, -> text do
      self.left_outer_joins(:names, :descriptions)
          .where("descriptions.text ~* ?", "\\m#{text}.*")
          .distinct ;end

   scope :by_tokens, -> string_in do
      return self if string_in.blank?
      # TODO fix the correctness of the query
      klass = self.model_name.name.constantize
      or_rel_tokens = string_in.split(/\//).map do |or_token|
         # OR operation
         or_token.strip.split(/\s+/).reduce(nil) do |rel, and_token|
            # AND operation
            and_rel = klass.by_token(and_token)
            rel && rel.merge(and_rel) || and_rel ;end;end
      or_rel = or_rel_tokens.reduce { |sum_rel, rel| sum_rel.or(rel) }
      self.merge(or_rel).distinct ;end

   scope :by_kind_code, -> kind_code do
      where(kind_code: kind_code) ;end

   scope :with_kind_title, -> context do
      language_codes = [ context[:locales] ].flatten
      selector = self.select_values.dup
      if selector.empty?
         selector << 'subjects.*'
      end
      selector << "kind_titles.text AS _kind_title"

      join = "LEFT OUTER JOIN subjects AS subject_kinds
                           ON subject_kinds.kind_code = 'SubjectKind'
                          AND subject_kinds.key = subjects.kind_code
              LEFT OUTER JOIN descriptions AS kind_titles
                           ON kind_titles.describable_id = subject_kinds.id
                          AND kind_titles.describable_type = 'Subject'
                          AND kind_titles.type = 'Appellation'
                          AND kind_titles.language_code IN ('#{language_codes.join("', '")}')"

      joins(join).select(selector).group(:id, "kind_titles.text") ;end

   scope :with_descriptions, -> context do
      language_codes = [ context[:locales] ].flatten
      alphabeth_codes = Languageble.alphabeth_list_for( language_codes ).flatten
      selector = self.select_values.dup
      if self.select_values.dup.empty?
         selector << 'subjects.*'
      end

      selector << "COALESCE((WITH __descriptions AS (
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
                        JOIN descriptions AS language_names
                          ON language_names.describable_id = languages.id
                         AND language_names.describable_type = 'Subject'
                         AND language_names.language_code IN ('#{language_codes.join("', '")}')
             LEFT OUTER JOIN subjects AS alphabeths
                          ON alphabeths.key = descriptions.alphabeth_code
                        JOIN descriptions AS alphabeth_names
                          ON alphabeth_names.describable_id = alphabeths.id
                         AND alphabeth_names.describable_type = 'Subject'
                         AND alphabeth_names.alphabeth_code IN ('#{alphabeth_codes.join("', '")}')
                       WHERE descriptions.describable_id = subjects.id
                         AND descriptions.describable_type = 'Subject'
                         AND descriptions.type IN ('Description')
                    GROUP BY descriptions.id, language_names.text, alphabeth_names.text)
                      SELECT jsonb_agg(__descriptions)
                        FROM __descriptions), '[]'::jsonb) AS _descriptions"

      select(selector).group(:id) ;end

   scope :with_names, -> context do
      language_codes = [ context[:locales] ].flatten
      alphabeth_codes = Languageble.alphabeth_list_for( language_codes ).flatten
      selector = self.select_values.dup
      if self.select_values.dup.empty?
         selector << 'subjects.*'
      end

      selector << "COALESCE((WITH __names AS (
                      SELECT DISTINCT ON(names.id)
                             names.id AS id,
                             names.type AS type,
                             names.text AS text,
                             names.language_code AS language_code,
                             names.alphabeth_code AS alphabeth_code,
                             language_names.text AS language,
                             alphabeth_names.text AS alphabeth
                        FROM descriptions AS names
             LEFT OUTER JOIN subjects AS languages
                          ON languages.key = names.language_code
                        JOIN descriptions AS language_names
                          ON language_names.describable_id = languages.id
                         AND language_names.describable_type = 'Subject'
                         AND language_names.language_code IN ('#{language_codes.join("', '")}')
             LEFT OUTER JOIN subjects AS alphabeths
                          ON alphabeths.key = names.alphabeth_code
                        JOIN descriptions AS alphabeth_names
                          ON alphabeth_names.describable_id = alphabeths.id
                         AND alphabeth_names.describable_type = 'Subject'
                         AND alphabeth_names.alphabeth_code IN ('#{alphabeth_codes.join("', '")}')
                       WHERE names.describable_id = subjects.id
                         AND names.describable_type = 'Subject'
                         AND names.type IN ('Appellation')
                    GROUP BY names.id, language_names.text, alphabeth_names.text)
                      SELECT jsonb_agg(__names)
                        FROM __names), '[]'::jsonb) AS _names"

      select(selector).group(:id) ;end

   singleton_class.send(:alias_method, :t, :by_token)
   singleton_class.send(:alias_method, :q, :by_tokens)
   singleton_class.send(:alias_method, :k, :by_kind_code)

   accepts_nested_attributes_for :names, reject_if: :all_blank, allow_destroy: true
   accepts_nested_attributes_for :descriptions, reject_if: :all_blank, allow_destroy: true

   validates_presence_of :key, :kind_code
   validates_uniqueness_of :key
   validates :meta, json: { schema: JSON_SCHEMA }

   JSON_ATTRS = {
      meta: ->(this) { this.meta.to_json },
      created_at: nil,
      updated_at: nil,
   }
end
