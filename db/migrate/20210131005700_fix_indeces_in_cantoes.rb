class FixIndecesInCantoes < ActiveRecord::Migration[5.2]
   def change
      reversible do |dir|
         dir.up do
            qs = [
                 # copy duplications
                   "WITH _service_cantoes AS (
                  SELECT b.canto_id AS source_id,
                         a.canto_id AS target_id
                    FROM service_cantoes AS a
                    JOIN cantoes AS c
                      ON c.id = a.canto_id
                    JOIN cantoes AS d
                      ON c.title = d.title
                     AND c.id <> d.id
                    JOIN service_cantoes AS b
                      ON b.canto_id = d.id
                     AND a.id > b.id)
                  UPDATE service_cantoes
                     SET canto_id = _service_cantoes.source_id
                    FROM _service_cantoes
                   WHERE service_cantoes.canto_id = _service_cantoes.target_id",
                 # dedup
                 "DELETE
                    FROM cantoes a
                   USING cantoes b
                   WHERE a.id > b.id
                     AND a.title = b.title" ].each do |q|
              Canto.connection.execute(q)
            end
         end
      end

      change_table :cantoes do |t|
         t.index %i(prosomeion_title)
         t.index %i(tone)
         t.index %i(type)
         t.index %i(title), unique: true
         t.index %i(author)
         t.index %i(language_code alphabeth_code)
         t.index %i(id language_code) ;end;end;end
