class User < ApplicationRecord
   include Tiun::Model::Auth

   has_one :email, class_name: "Account::Email"
   has_one :session_token, class_name: "Token::Session"
   has_one :refresh_token, class_name: "Token::Refresh"

   before_validation :fill_in_account

   scope :by_credentials_or_id, ->(croi) do
      where(id: croi).or(where("users.settings @> ?", "{\"name\": \"#{croi}\"}"))
   end

   scope :by_uno, ->(uno) do
      joins(:accounts).where(accounts:  { no: uno })
   end

   scope :with_accounts, ->(context) do
      this = table.table_alias || table.name
      /`(?<method>(?:with_(?<rela>\w+)|[^']*))'/ =~ caller.grep(/delegation/)[1]
      attrs = context[:only] || self.model.attribute_names
      as = model.reflections[rela].name
      selects = attrs.map { |x| "#{as}.#{x} AS #{x}" }
      groups = attrs.map { |x| "#{as}.#{x}" }

      selector = self.select_values.dup
      selector << "#{this}.*" if selector.empty?
      selector << "COALESCE((WITH __#{as} AS (
                      SELECT #{selects.join(",")}
                        FROM #{as}
                       WHERE #{this}.id = #{as}.#{this.singularize}_id
                    GROUP BY #{groups.join(",")})
                      SELECT jsonb_agg(__#{as})
                        FROM __#{as}), '[]'::jsonb) AS _#{as}"

      select(selector).group(:id)
   end

   def name
      [settings["name"], settings["last_name"]].compact.join(" ")
   end

   def uid
      [accounts.first&.no, accounts.first&.type].join("#")
   end

   def no= value
      @no = value
   end

   def type= value
      @type = value
   end

   def fill_in_account
      if @no or @type
         attrs = {}
         attrs[:no] = @no if @no
         attrs[:type] = @type if @type

         if @type && account = accounts.where(type: @type).first
            account.assign_attributes(**attrs)
            account.save!(validate: false)
         else
            accounts << Account.new(**attrs)
         end
      end
   end
end
