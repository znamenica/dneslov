class Scriptum < ActiveRecord::Base
   extend TotalSize
   include Languageble
   include Tokens
   include WithLocaleNames

   has_many :memo_scripta, inverse_of: :scriptum, dependent: :destroy
   has_many :memoes, through: :memo_scripta
   has_many :targets, through: :memo_scripta, foreign_key: :memo_id, source: :memo

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

   scope :with_memoried_memoes, -> context do
      as = table.table_alias || table.name
      language_codes = [context[:locales]].flatten
      alphabeth_codes = Languageble.alphabeth_list_for(language_codes).flatten
      selector = self.select_values.dup
      if self.select_values.dup.empty?
         selector << "#{as}.*"
      end

      selector = "COALESCE((
                        WITH __memo_scripta AS (
                      SELECT memo_scripta.id AS id,
                             #{as}_memoes.id AS memo_id,
                             #{as}_memories.short_name || ' [' ||
                             COALESCE(#{as}_event_titles.text, '') || ' (' ||
                             #{as}_events.happened_at || ')]: ' ||
                             COALESCE(#{as}_memo_titles.text, '') || '[' ||
                             COALESCE(#{as}_calendary_titles.text, '') || ' (' ||
                             #{as}_memoes.year_date || ')]' AS memo_name,
                             memo_scripta.kind AS kind
                        FROM memo_scripta
             LEFT OUTER JOIN memoes AS #{as}_memoes
                          ON #{as}_memoes.id = memo_scripta.memo_id
             LEFT OUTER JOIN descriptions AS #{as}_memo_titles
                          ON #{as}_memo_titles.describable_id = #{as}_memoes.id
                         AND #{as}_memo_titles.describable_type = 'Memo'
                         AND #{as}_memo_titles.type = 'Title'
                         AND #{as}_memo_titles.language_code IN ('#{language_codes.join("', '")}')
                         AND #{as}_memo_titles.alphabeth_code IN ('#{alphabeth_codes.join("', '")}')
             LEFT OUTER JOIN events AS #{as}_events
                          ON #{as}_memoes.event_id = #{as}_events.id
                        JOIN subjects AS #{as}_event_kinds
                          ON #{as}_event_kinds.key = #{as}_events.kind_code
                         AND #{as}_event_kinds.kind_code = 'EventKind'
                        JOIN descriptions AS #{as}_event_titles
                          ON #{as}_event_titles.id IS NOT NULL
                         AND (#{as}_event_titles.describable_id = #{as}_events.id
                         AND #{as}_event_titles.describable_type = 'Event'
                         AND #{as}_event_titles.type = 'Title'
                          OR #{as}_event_titles.describable_id = #{as}_event_kinds.id
                         AND #{as}_event_titles.describable_type = 'Subject'
                         AND #{as}_event_titles.type = 'Appellation')
                         AND #{as}_event_titles.alphabeth_code IN ('#{alphabeth_codes.join("', '")}')
                         AND #{as}_event_titles.language_code IN ('#{language_codes.join("', '")}')
             LEFT OUTER JOIN calendaries AS #{as}_calendaries
                          ON #{as}_calendaries.id = #{as}_memoes.calendary_id
                        JOIN descriptions AS #{as}_calendary_titles
                          ON #{as}_calendary_titles.describable_id = #{as}_calendaries.id
                         AND #{as}_calendary_titles.describable_type = 'Calendary'
                         AND #{as}_calendary_titles.type = 'Appellation'
                         AND #{as}_calendary_titles.language_code IN ('#{language_codes.join("', '")}')
                         AND #{as}_calendary_titles.alphabeth_code IN ('#{alphabeth_codes.join("', '")}')
             LEFT OUTER JOIN memories AS #{as}_memories
                          ON #{as}_memories.id = #{as}_events.memory_id
                       WHERE memo_scripta.scriptum_id = #{as}.id
                    GROUP BY memo_scripta.id, #{as}_memories.short_name, #{as}_memoes.id, memo_scripta.kind, #{as}_memo_titles.text, #{as}_events.happened_at ,#{as}_event_titles.text, #{as}_calendary_titles.text, #{as}_memoes.year_date)
                      SELECT jsonb_agg(__memo_scripta)
                        FROM __memo_scripta), '[]'::jsonb) AS _memo_scripta"

      select(selector).group(:id)
   end

   accepts_nested_attributes_for :memo_scripta, reject_if: :all_blank, allow_destroy: true

   has_alphabeth on: %i(text title)

   validates :type, :memo_scripta, presence: true
end
