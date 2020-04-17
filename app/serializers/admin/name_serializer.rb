class Admin::NameSerializer < ApplicationSerializer
   attributes :id, :text, :language_code, :language, :alphabeth_code, :alphabeth, :root_id, :root,
              :bind_kind_code, :bind_kind_name, :bond_to_id, :bond_to

   def bind_kind_name
      object.bind_kind&.names&.for( locales )&.text ;end

   def language
      object.language_for( locales )&.text ;end

   def alphabeth
      object.alphabeth_for( locales )&.text ;end

   def root
      object.root&.text ;end

   def bond_to
      object.bond_to&.text ;end;end
