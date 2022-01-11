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

#   validates :language_code, inclusion: { in: Languageble.language_list }
#   validates :alphabeth_code, inclusion: { in: proc { |l| Languageble.alphabeth_list_for(l.language_code)}}
   validates :type, presence: true
end
