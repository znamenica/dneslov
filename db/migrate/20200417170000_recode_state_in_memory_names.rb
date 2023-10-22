class RecodeStateInMemoryNames < ActiveRecord::Migration[5.2]
   safety_assured

   def up
      states = [ :наречёное, :самоданное, :крещенское, :чернецкое, :иноческое,
         :схимное, :отчество, :отчество_принятое, :кумство, :благословенное,
         :покаянное, :отечья, :мужнина, :наречёная, :самоданная, :матерня,
         :прозвание, :подвига_мученичества, :подвига_пастырства, :подвига_святительства,
         :подвига_страстотерпчества, :подвига_исповедничества, :подвига_чтецтва,
         :подвига_дияконства, :подвига_учительства, :подвига_отшельничества ]

      rename_column :memory_names, :state_code, :_state_code
      change_table :memory_names do |t|
         t.string :state_code, index: true end

      MemoryName.find_each { |mn| mn.update!(state_code: states[mn._state_code]) }

      remove_column :memory_names, :_state_code
      change_column_null :memory_names, :state_code, false
   end
end
