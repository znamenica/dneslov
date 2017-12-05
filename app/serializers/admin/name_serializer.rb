class Admin::NameSerializer < ApplicationSerializer
   attributes :id, :text, :language_code, :alphabeth_code, :root_id, :root, :bind_kind, :bond_to_id, :bond_to

   def root
      object.root&.text ;end

   def bond_to
      object.bond_to&.text ;end;end
