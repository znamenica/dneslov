class CopyNominaToNames < ActiveRecord::Migration[7.0]
   safety_assured

   def change
      reversible do |dir|
         dir.up do
            [
            "INSERT INTO names
                        (text, language_code, alphabeth_code, created_at, updated_at)
                  SELECT nomina.text, nomina.language_code, nomina.alphabeth_code, now(), now()
                    FROM nomina",
                 "UPDATE nomina
                     SET name_id = names.id
                    FROM names
                   WHERE names.language_code = nomina.language_code
                     AND names.alphabeth_code = nomina.alphabeth_code
                     AND names.text = nomina.text"
            ].each { |sql| ActiveRecord::Base.connection.execute(sql) }
         end

         Subject.by_kind_code("NameBind").find_each.with_index do |s, i|
            s.meta["order"] = i

            s.save!
         end

         Nomen.find_each do |n|
            root_id = n.root_id && Nomen.where(id: n.root_id).first&.name&.id
            bond_to_id = n.bond_to_id && Nomen.where(id: n.bond_to_id).first&.name&.id
            bind_kind_code = bond_to_id ? n.bind_kind_code : 'несвязаное'

            n.update_columns(root_id: root_id, bond_to_id: bond_to_id, bind_kind_code: bind_kind_code)
         end
      end

      change_table :nomina do |t|
         t.remove :text, type: :string, null: false
         t.remove :language_code, type: :string, null: false
         t.remove :alphabeth_code, type: :string, null: false

         t.rename :bind_kind_code, :bind_kind_name

         t.string :bind_kind_path, null: true
      end

      change_column_null :nomina, :name_id, false
   end
end
