# bind_kind_name(string)  - kind of binding
# bond_to_id(int)         - id of name which the name is linked (bond) to
class Nomen < ActiveRecord::Base
   extend TotalSize

   # enum :bind_kind_name, %i(несвязаное прилаженое уменьшительное переводное подобное переложеное присвоеное)

   has_many :memory_names
   has_many :memories, through: :memory_names
   has_many :children, class_name: :Nomen, foreign_key: :bond_to_id

   belongs_to :bind_kind, primary_key: :key, foreign_key: :bind_kind_name, class_name: :Subject
   belongs_to :bond_to, primary_key: :id, foreign_key: :bond_to_id, class_name: :Name
   belongs_to :root, primary_key: :id, foreign_key: :root_id, class_name: :Name
   belongs_to :name

   scope :by_token, -> text do
      left_outer_joins(:name).where("names.text ~* ?", "\\m#{text}.*").distinct
   end

   # required for short list
   scope :with_key, -> _ do
      join_name = table.table_alias || table.name
      selector = self.select_values.dup | ["#{join_name}.id AS _key"]

      select(selector).group('_key').reorder("_key")
   end

   scope :with_value, -> context do
      join_name = table.table_alias || table.name
      language_codes = [ context[:locales] ].flatten
      alphabeth_codes = Languageble.alphabeth_list_for(language_codes).flatten
      selector = self.select_values.dup |
        ["#{join_name}_names.text || COALESCE(' < ' || #{join_name}_bond_toes.text, '') || ' (' || #{join_name}_names.language_code || '_' || #{join_name}_names.alphabeth_code || ')' AS _value"]

      join = "LEFT OUTER JOIN names AS #{join_name}_names
                           ON #{join_name}.name_id = #{join_name}_names.id
              LEFT OUTER JOIN names AS #{join_name}_bond_toes
                           ON #{join_name}.bond_to_id = #{join_name}_bond_toes.id"

      # binding.pry
      joins(join).select(selector).group(:id, "#{join_name}_names.text", "#{join_name}_bond_toes.text", "#{join_name}_names.language_code", "#{join_name}_names.alphabeth_code")
   end

   scope :with_root_name, -> context do
      join_name = table.table_alias || table.name
      language_codes = [ context[:locales] ].flatten
      selector = self.select_values.dup
      if self.select_values.dup.empty?
         selector << "#{join_name}.*"
      end
      selector << "root_names.text || ' (' || root_descriptions.text || ')' AS _root_name"

      join = "LEFT OUTER JOIN nomina AS root_#{join_name}
                           ON root_#{join_name}.id = #{join_name}.root_id
                    LEFT JOIN names AS root_names
                           ON root_names.id = root_#{join_name}.name_id
                         JOIN subjects AS root_languages
                           ON root_languages.key = root_names.language_code
              LEFT OUTER JOIN descriptions AS root_descriptions
                           ON root_descriptions.describable_id = root_languages.id
                          AND root_descriptions.describable_type = 'Subject'
                          AND root_descriptions.language_code IN ('#{language_codes.join("', '")}')"

      joins(join).select(selector).group(:id, 'root_names.text', 'root_descriptions.text')
   end

   scope :with_bond_to_name, -> context do
      join_name = table.table_alias || table.name
      language_codes = [ context[:locales] ].flatten
      selector = self.select_values.dup
      if selector.empty?
         selector << "#{join_name}.*"
      end
      selector << "bond_to_names.text || ' (' || bond_to_descriptions.text || ')' AS _bond_to_name"

      join = "LEFT OUTER JOIN nomina AS bond_to_#{join_name}
                           ON bond_to_#{join_name}.id = #{join_name}.bond_to_id
                    LEFT JOIN names AS bond_to_names
                           ON bond_to_names.id = bond_to_#{join_name}.name_id
              LEFT OUTER JOIN subjects AS bond_to_languages
                           ON bond_to_languages.key = bond_to_names.language_code
              LEFT OUTER JOIN descriptions AS bond_to_descriptions
                           ON bond_to_descriptions.describable_id = bond_to_languages.id
                          AND bond_to_descriptions.describable_type = 'Subject'
                          AND bond_to_descriptions.language_code IN ('#{language_codes.join("', '")}')"

      joins(join).select(selector).group(:id, 'bond_to_names.text', 'bond_to_descriptions.text')
   end

   scope :by_root, -> do
      model.where(root_id: self.select(:root_id))
   end

   scope :with_bind_kind_name, -> context do
      join_name = table.table_alias || table.name
      language_codes = [ context[:locales] ].flatten
      selector = self.select_values.dup
      if selector.empty?
         selector << "#{join_name}.*"
      end
      selector << 'bind_kind_names.text AS _bind_kind_name'

      join = "LEFT OUTER JOIN subjects AS bind_kinds
                           ON bind_kinds.kind_code = 'NameBind'
                          AND bind_kinds.key = #{join_name}.bind_kind_name
                         JOIN descriptions AS bind_kind_names
                           ON bind_kind_names.describable_id = bind_kinds.id
                          AND bind_kind_names.describable_type = 'Subject'
                          AND bind_kind_names.language_code IN ('#{language_codes.join("', '")}')"

      joins(join).select(selector).group(:id, 'bind_kind_names.text')
   end

   singleton_class.send(:alias_method, :t, :by_token)

   validates_presence_of :bind_kind, :bind_kind_path
   validates_presence_of :bond_to_id, if: :bond?
   validates_absence_of :bond_to_id, unless: :bond?

   before_validation -> { self.bind_kind_name ||= 'несвязаное' }, on: :create
   before_validation :fill_bind_kind_path
   after_save :fill_root_id, unless: :root_id?

   def bond?
      bind_kind_name != 'несвязаное'
   end

   def fill_bind_kind_path
      parent = bond_to.nomina.where(root_id: self.root_id).first || bond_to.nomina.first if bond_to_id
      self.bind_kind_path = [parent&.store_bind_kind_path!, bind_kind.order].compact.join(".")
   end

   def store_bind_kind_path!
      save! if fill_bind_kind_path && changed?

      self.bind_kind_path
   end

   def fill_root_id
      new_root_id = self.bond_to&.nomina&.first&.root_id || name_id
      self.update!(root_id: new_root_id)
   end
end
