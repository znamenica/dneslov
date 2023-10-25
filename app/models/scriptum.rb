class Scriptum < ActiveRecord::Base
   extend TotalSize
   include Languageble
   include Tokens
   include WithLocaleNames

   has_alphabeth on: %i(text title)

   scope :by_token, -> text do
      join_name = table.table_alias || table.name
      where("#{join_name}.description ~* ?", "\\m#{text}.*").or(
      where("#{join_name}.title ~* ?", "\\m#{text}.*").or(
      where("#{join_name}.prosomeion_title ~* ?", "\\m#{text}.*").or(
      where("unaccent(#{join_name}.text) ~* unaccent(?)", "\\m#{text}.*"))))
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
