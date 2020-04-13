# bind_kind(string)  - kind of binding
# bond_to_id(int)    - id of name which the name is linked (bond) to
class Name < ActiveRecord::Base
   include Languageble

   has_many :memories, through: :memory_names
   has_many :memory_names
   has_many :children, class_name: :Name, foreign_key: :bond_to_id

   belongs_to :bond_to, class_name: :Name
   belongs_to :root, class_name: :Name

   #enum bind_kind: [ 'несвязаное', 'переводное', 'прилаженое', 'переложеное', 'уменьшительное', 'подобное' ]

   has_alphabeth on: { text: [ :nosyntax, allow: " ‑" ] }

   scope :with_token, -> text { where( "text ~* ?", text ) }

   scope :with_tokens, -> string_in do
      return self if string_in.blank?
      # TODO fix the correctness of the query
      klass = self.model_name.name.constantize
      or_rel_tokens = string_in.split(/\//).map do |or_token|
         # OR operation
         or_token.strip.split(/\s+/).reduce(nil) do |rel, and_token|
            # AND operation
            and_rel = klass.with_token(and_token)
            rel && rel.merge(and_rel) || and_rel ;end;end
      or_rel = or_rel_tokens.reduce { |sum_rel, rel| sum_rel.or(rel) }
      self.merge(or_rel).distinct ;end

   singleton_class.send(:alias_method, :t, :with_token)
   singleton_class.send(:alias_method, :q, :with_tokens)

   validates_presence_of :text, :language_code
   validates_presence_of :bond_to_id, if: :bond?
   validates_absence_of :bond_to_id, unless: :bond?

   before_validation -> { self.bind_kind ||= 'несвязаное' }
   after_save :fill_root_id, on: :create, unless: :root_id?

   def bond?
      bind_kind != 'несвязаное' ;end

   def fill_root_id
      new_root_id = self.bond_to&.root_id || self.id
      self.update!(root_id: new_root_id) ;end;end
