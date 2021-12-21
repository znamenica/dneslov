class Item < ActiveRecord::Base
   extend TotalSize
   extend AsJson

   belongs_to :item_type
   has_many :events

   accepts_nested_attributes_for :item_type

   scope :by_token, -> token { unscoped.joins( :item_type ).merge(ItemType.by_token( token )) }

   singleton_class.send(:alias_method, :t, :by_token)

   # required for short list
   scope :with_key, -> _ do
      selector = [ "#{model.table_name}.id AS _key" ]

      select(selector).group('_key').reorder("_key")
   end

   scope :with_value, -> context do
      language_codes = [ context[:locales] ].flatten
      alphabeth_codes = Languageble.alphabeth_list_for( language_codes ).flatten
      selector = self.select_values.dup

      join = "LEFT OUTER JOIN descriptions AS titles
                           ON titles.describable_id = items.item_type_id
                          AND titles.describable_type = 'ItemType'
                          AND titles.type IN ('Description')
              LEFT OUTER JOIN subjects AS languages
                           ON languages.key = titles.language_code
              LEFT OUTER JOIN descriptions AS language_names
                           ON language_names.describable_id = languages.id
                          AND language_names.describable_type = 'Order'
                          AND language_names.language_code IN ('#{language_codes.join("', '")}')
              LEFT OUTER JOIN subjects AS alphabeths
                           ON alphabeths.key = titles.alphabeth_code
              LEFT OUTER JOIN descriptions AS alphabeth_names
                           ON alphabeth_names.describable_id = alphabeths.id
                          AND alphabeth_names.describable_type = 'Order'
                          AND alphabeth_names.alphabeth_code IN ('#{alphabeth_codes.join("', '")}')"

      selector << "titles.text AS _value"

      joins(join).select(selector).group(:id, "titles.text")
   end
end
