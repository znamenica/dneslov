class Order < ActiveRecord::Base
   extend TotalSize

   has_one :slug, as: :sluggable, dependent: :destroy
   has_many :notes, as: :describable, dependent: :delete_all, class_name: :Note
   has_many :tweets, as: :describable, dependent: :delete_all, class_name: :Tweet
   has_many :descriptions, -> { where( type: :Description ) }, as: :describable, dependent: :delete_all
   has_many :memo_orders
   has_many :memoes, through: :memo_orders
   has_many :memories, through: :slug

   accepts_nested_attributes_for :descriptions, reject_if: :all_blank, allow_destroy: true
   accepts_nested_attributes_for :notes, reject_if: :all_blank, allow_destroy: true
   accepts_nested_attributes_for :tweets, reject_if: :all_blank, allow_destroy: true
   accepts_nested_attributes_for :slug, reject_if: :all_blank

   scope :by_token, -> text do
      left_outer_joins( :slug, :descriptions, :notes, :tweets ).
         where( "slugs.text ~* ?", "\\m#{text}.*" ).or(
         where( "descriptions.text ~* ?", "\\m#{text}.*" ).or(
         where( "tweets_orders.text ~* ?", "\\m#{text}.*" ).or(
         where( "notes_orders.text ~* ?", "\\m#{text}.*" )))).distinct ;end


   scope :by_tokens, -> string_in do
      return self if string_in.blank?
      # TODO fix the correctness of the query
      klass = self.model_name.name.constantize
      or_rel_tokens = string_in.split(/\//).map do |or_token|
         # OR operation
         or_token.strip.split(/\s+/).reduce(nil) do |rel, and_token|
            # AND operation
            and_rel = klass.by_token(and_token)
            rel && rel.merge(and_rel) || and_rel ;end;end
      or_rel = or_rel_tokens.reduce { |sum_rel, rel| sum_rel.or(rel) }
      self.merge(or_rel).distinct ;end

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
                           ON titles.describable_id = orders.id
                          AND titles.describable_type = 'Order'
                          AND titles.type IN ('Note')
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

      # binding.pry
      joins(join).select(selector).group(:id, "titles.text")
   end

   scope :with_slug, -> do
      selector = self.select_values.dup
      if self.select_values.dup.empty?
         selector << 'orders.*'
      end

      selector << "jsonb_build_object('id', order_slugs.id, 'text', order_slugs.text) AS _slug"
      join = "LEFT OUTER JOIN slugs AS order_slugs
                           ON order_slugs.sluggable_id = orders.id
                          AND order_slugs.sluggable_type = 'Order'"

      joins(join).select(selector).group(:id, 'order_slugs.id', 'order_slugs.text') ;end

   scope :with_descriptions, -> context do
      language_codes = [ context[:locales] ].flatten
      alphabeth_codes = Languageble.alphabeth_list_for( language_codes ).flatten
      selector = self.select_values.dup
      if self.select_values.dup.empty?
         selector << 'orders.*'
      end

      selector << "COALESCE((WITH __descriptions AS (
                      SELECT DISTINCT ON(descriptions.id)
                             descriptions.id AS id,
                             descriptions.type AS type,
                             descriptions.text AS text,
                             descriptions.language_code AS language_code,
                             descriptions.alphabeth_code AS alphabeth_code,
                             language_names.text AS language,
                             alphabeth_names.text AS alphabeth
                        FROM descriptions
             LEFT OUTER JOIN subjects AS languages
                          ON languages.key = descriptions.language_code
                        JOIN descriptions AS language_names
                          ON language_names.describable_id = languages.id
                         AND language_names.describable_type = 'Subject'
                         AND language_names.language_code IN ('#{language_codes.join("', '")}')
             LEFT OUTER JOIN subjects AS alphabeths
                          ON alphabeths.key = descriptions.alphabeth_code
                        JOIN descriptions AS alphabeth_names
                          ON alphabeth_names.describable_id = alphabeths.id
                         AND alphabeth_names.describable_type = 'Subject'
                         AND alphabeth_names.alphabeth_code IN ('#{alphabeth_codes.join("', '")}')
                       WHERE descriptions.describable_id = orders.id
                         AND descriptions.describable_type = 'Order'
                         AND descriptions.type IN ('Tweet', 'Note', 'Description')
                    GROUP BY descriptions.id, language_names.text, alphabeth_names.text)
                      SELECT jsonb_agg(__descriptions)
                        FROM __descriptions), '[]'::jsonb) AS _descriptions"

      select(selector).group(:id) ;end

   singleton_class.send(:alias_method, :t, :by_token)
   singleton_class.send(:alias_method, :q, :by_tokens)

   validates_presence_of :slug, :notes, :tweets
end
