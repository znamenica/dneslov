class Scriptum < ActiveRecord::Base
   extend TotalSize
   extend AsJson
   include Languageble
   include Tokens
   include WithLocaleNames

   JSON_ATTRS = {
      created_at: nil,
      updated_at: nil,
   }
   EXCEPT = %i(created_at updated_at)

   has_alphabeth on: %i(text title)

   scope :by_token, -> text do
      where("description ~* ?", "\\m#{text}.*").or(
      where("title ~* ?", "\\m#{text}.*").or(
      where("prosomeion_title ~* ?", "\\m#{text}.*").or(
      where("text ~* ?", "\\m#{text}.*"))))
   end
   singleton_class.send(:alias_method, :t, :by_token)

   # required for short list
   scope :with_key, -> _ do
      selector = ["#{table.name}.id AS _key"]

      select(selector).group('_key')
   end

   scope :with_value, -> context do
      join_name = table.table_alias || table.name
      selector = ["#{join_name}.text AS _value"]
      if self.select_values.dup.empty?
        selector.unshift("#{join_name}.*")
      end

      select(selector.uniq).group('_value')
   end

   validates :type, presence: true
end
