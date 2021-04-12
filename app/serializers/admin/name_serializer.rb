class Admin::NameSerializer < ApplicationSerializer
   attributes :id, :text, :language_code, :language, :alphabeth_code, :alphabeth, :root_id, :root,
              :bind_kind_code, :bind_kind_name, :bond_to_id, :bond_to

   def bind_kind_name
      object._bind_kind_name ;end

   def language
      object._language ;end

   def alphabeth
      object._alphabeth ;end

   def root
      object._root_name ;end

   def bond_to
      object._bond_to_name ;end;end
