class Name < ActiveRecord::Base
   extend TotalSize
   include Languageble
   include WithDescriptions
   include WithLinks
   include WithLocaleNames

   belongs_to :language, primary_key: :key, foreign_key: :language_code, class_name: :Subject
   belongs_to :alphabeth, primary_key: :key, foreign_key: :alphabeth_code, class_name: :Subject

   has_many :nomina

   has_alphabeth on: { text: [ :nosyntax, allow: " ‑" ] }

   scope :by_token, -> text do
      join_name = table.table_alias || table.name
      where("#{join_name}.text ~* ?", "\\m#{text}.*")
   end
   singleton_class.send(:alias_method, :t, :by_token)

   scope :by_tokens, -> string_in do
      return self if string_in.blank?
      # TODO fix the correctness of the query
      klass = self.model_name.name.constantize
      or_rel_tokens = string_in.split(/\//).map do |or_token|
         # OR operation
         or_token.strip.split(/\s+/).reduce(nil) do |rel, and_token|
            # AND operation
            and_rel = klass.by_token(and_token)
            rel && rel.merge(and_rel) || and_rel
         end
      end
      or_rel = or_rel_tokens.reduce { |sum_rel, rel| sum_rel.or(rel) }
      self.merge(or_rel).distinct
   end

   scope :by_root, -> do
      if where_clause.send(:predicates).any?
         model.joins(:nomina).where(nomina: { root_id: self.joins(:nomina).select('nomina.root_id') }).group('nomina.root_id').distinct
      else
         self
      end
   end

   # required for short list
   scope :with_key, -> _ do
      selector = self.select_values.dup | ["#{model.table_name}.id AS _key"]

      select(selector).group('_key').reorder("_key")
   end

   scope :with_value, -> context do
      language_codes = [ context[:locales] ].flatten
      alphabeth_codes = Languageble.alphabeth_list_for( language_codes ).flatten
      selector = self.select_values.dup |
         ["#{model.table_name}.text || ' (' || languages.key || '_' || alphabeths.key || ')' AS _value"]

      join = "LEFT OUTER JOIN subjects AS languages
                           ON languages.key = #{model.table_name}.language_code
              LEFT OUTER JOIN descriptions AS language_names
                           ON language_names.describable_id = languages.id
                          AND language_names.describable_type = 'Order'
                          AND language_names.language_code IN ('#{language_codes.join("', '")}')
              LEFT OUTER JOIN subjects AS alphabeths
                           ON alphabeths.key = #{model.table_name}.alphabeth_code
              LEFT OUTER JOIN descriptions AS alphabeth_names
                           ON alphabeth_names.describable_id = alphabeths.id
                          AND alphabeth_names.describable_type = 'Order'
                          AND alphabeth_names.alphabeth_code IN ('#{alphabeth_codes.join("', '")}')"

      # binding.pry
      joins(join).select(selector).group(:id, "#{model.table_name}.text", "languages.key", "alphabeths.key")
   end

   scope :with_locale_names, -> context do
      language_codes = [ context[:locales] ].flatten
      alphabeth_codes = Languageble.alphabeth_list_for( language_codes ).flatten
      selector = self.select_values.dup
      if self.select_values.dup.empty?
         selector << 'names.*'
      end
      selector.concat [ "language_names.text AS _language", "alphabeth_names.text AS _alphabeth" ]

      join = "LEFT OUTER JOIN subjects AS languages
                           ON languages.key = names.language_code
              LEFT OUTER JOIN descriptions AS language_names
                           ON language_names.describable_id = languages.id
                          AND language_names.describable_type = 'Subject'
                          AND language_names.language_code IN ('#{language_codes.join("', '")}')
              LEFT OUTER JOIN subjects AS alphabeths
                           ON alphabeths.key = names.alphabeth_code
              LEFT OUTER JOIN descriptions AS alphabeth_names
                           ON alphabeth_names.describable_id = alphabeths.id
                          AND alphabeth_names.describable_type = 'Subject'
                          AND alphabeth_names.alphabeth_code IN ('#{alphabeth_codes.join("', '")}')"

      joins(join).select(selector).group(:id, 'language_names.text', 'alphabeth_names.text')
   end

   scope :with_nomina, -> context do
      join_name = table.table_alias || table.name
      language_codes = [context[:locales]].flatten
      alphabeth_codes = Languageble.alphabeth_list_for(language_codes).flatten
      selector = self.select_values.dup
      selector << "#{join_name}.*" if self.select_values.dup.empty?
      selector << "COALESCE((WITH __nomina AS (
                      SELECT DISTINCT ON(nomina.id)
                             nomina.id AS id,
                             nomina.bind_kind_name AS bind_kind_name,
                             bind_kind_names.text AS bind_kind_humanized,
                             nomina.modifier AS modifier,
                             nomina.bond_to_id AS bond_to_id,
                             bond_to_names.text || ' (' || bond_to_names.language_code || '_' || bond_to_names.alphabeth_code || ')' AS bond_to_name,
                             nomina.root_id AS root_id,
                             root_names.text || ' (' || root_names.language_code || '_' || root_names.alphabeth_code || ')' AS root_name
                        FROM nomina
             LEFT OUTER JOIN names AS bond_to_names
                          ON bond_to_names.id = nomina.bond_to_id
             LEFT OUTER JOIN names AS root_names
                          ON root_names.id = nomina.root_id
             LEFT OUTER JOIN subjects AS bind_kinds
                          ON bind_kinds.kind_code = 'NameBind'
                         AND bind_kinds.key = nomina.bind_kind_name
                        JOIN descriptions AS bind_kind_names
                          ON bind_kind_names.describable_id = bind_kinds.id
                         AND bind_kind_names.describable_type = 'Subject'
                         AND bind_kind_names.language_code IN ('#{language_codes.join("', '")}')
                       WHERE names.id = nomina.name_id
                    GROUP BY root_names.language_code, root_names.alphabeth_code, root_names.text, bond_to_names.language_code, bond_to_names.alphabeth_code, bond_to_names.text, bind_kind_names.text, nomina.id)
                      SELECT jsonb_agg(__nomina)
                        FROM __nomina), '[]'::jsonb) AS _nomina"

      select(selector)
   end

   singleton_class.send(:alias_method, :t, :by_token)
   singleton_class.send(:alias_method, :q, :by_tokens)

   validates_presence_of :text, :language_code, :alphabeth_code
   before_save -> { self.text = self.text.strip }

   accepts_nested_attributes_for :nomina, reject_if: :all_blank, allow_destroy: true
end
