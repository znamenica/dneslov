# bind_kind_code(string)  - kind of binding
# bond_to_id(int)         - id of name which the name is linked (bond) to
class Name < ActiveRecord::Base
   extend TotalSize
   extend AsJson
   include Languageble

   has_many :memories, through: :memory_names
   has_many :memory_names
   has_many :children, class_name: :Name, foreign_key: :bond_to_id

   belongs_to :language, primary_key: :key, foreign_key: :language_code, class_name: :Subject
   belongs_to :alphabeth, primary_key: :key, foreign_key: :alphabeth_code, class_name: :Subject
   belongs_to :bind_kind, primary_key: :key, foreign_key: :bind_kind_code, class_name: :Subject
   belongs_to :bond_to, class_name: :Name
   belongs_to :root, class_name: :Name

   has_alphabeth on: { text: [ :nosyntax, allow: " ‑" ] }

   scope :by_token, -> text { where( "#{model.table_name}.text ~* ?", "\\m#{text}.*" ) }

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

      joins(join).select(selector).group(:id, 'language_names.text', 'alphabeth_names.text') ;end

   scope :with_root_name, -> context do
      language_codes = [ context[:locales] ].flatten
      selector = self.select_values.dup
      if self.select_values.dup.empty?
         selector << 'names.*'
      end
      selector << "root_names.text || ' (' || root_descriptions.text || ')' AS _root_name"

      join = "LEFT OUTER JOIN names AS root_names
                           ON root_names.id = names.root_id
                         JOIN subjects AS root_languages
                           ON root_languages.key = root_names.language_code
              LEFT OUTER JOIN descriptions AS root_descriptions
                           ON root_descriptions.describable_id = root_languages.id
                          AND root_descriptions.describable_type = 'Subject'
                          AND root_descriptions.language_code IN ('#{language_codes.join("', '")}')"

      joins(join).select(selector).group(:id, 'root_names.text', 'root_descriptions.text') ;end

   scope :with_bond_to_name, -> context do
      language_codes = [ context[:locales] ].flatten
      selector = self.select_values.dup
      if selector.empty?
         selector << 'names.*'
      end
      selector << "bond_to_names.text || ' (' || bond_to_descriptions.text || ')' AS _bond_to_name"

      join = "LEFT OUTER JOIN names AS bond_to_names
                           ON bond_to_names.id = names.bond_to_id
              LEFT OUTER JOIN subjects AS bond_to_languages
                           ON bond_to_languages.key = bond_to_names.language_code
              LEFT OUTER JOIN descriptions AS bond_to_descriptions
                           ON bond_to_descriptions.describable_id = bond_to_languages.id
                          AND bond_to_descriptions.describable_type = 'Subject'
                          AND bond_to_descriptions.language_code IN ('#{language_codes.join("', '")}')"

      joins(join).select(selector).group(:id, 'bond_to_names.text', 'bond_to_descriptions.text') ;end

   scope :with_bind_kind_name, -> context do
      language_codes = [ context[:locales] ].flatten
      selector = self.select_values.dup
      if selector.empty?
         selector << 'names.*'
      end
      selector << 'bind_kind_names.text AS _bind_kind_name'

      join = "LEFT OUTER JOIN subjects AS bind_kinds
                           ON bind_kinds.kind_code = 'NameBind'
                          AND bind_kinds.key = names.bind_kind_code
                         JOIN descriptions AS bind_kind_names
                           ON bind_kind_names.describable_id = bind_kinds.id
                          AND bind_kind_names.describable_type = 'Subject'
                          AND bind_kind_names.language_code IN ('#{language_codes.join("', '")}')"

      joins(join).select(selector).group(:id, 'bind_kind_names.text') ;end

   singleton_class.send(:alias_method, :t, :by_token)
   singleton_class.send(:alias_method, :q, :by_tokens)

   validates_presence_of :text, :language_code, :alphabeth_code, :bind_kind
   validates_presence_of :bond_to_id, if: :bond?
   validates_absence_of :bond_to_id, unless: :bond?

   before_validation -> { self.bind_kind_code ||= 'несвязаное' }, on: :create
   before_save -> { self.text = self.text.strip }
   after_save :fill_root_id, on: :create, unless: :root_id?

   def bond?
      bind_kind_code != 'несвязаное' ;end

   def fill_root_id
      new_root_id = self.bond_to&.root_id || self.id
      self.update!(root_id: new_root_id)
   end

   EXCEPT = %i(created_at updated_at)

   def as_json options = {}
      additionals = self.instance_variable_get(:@attributes).send(:attributes).send(:additional_types)
      original = super(options.merge(except: EXCEPT | additionals.keys))

      additionals.keys.reduce(original) do |r, key|
         if /^_(?<name>.*)/ =~ key
            r.merge(name => read_attribute(key).as_json)
         else
            r
         end
      end
   end
end
