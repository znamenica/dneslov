class TitleSerializer < ApplicationSerializer
   attributes :id, :text, :calendary, :language_code, :alphabeth_code

   def text
      object.text ;end

   def calendary
      object.describable&.calendary&.slug&.text ;end;end
