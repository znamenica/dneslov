class User < ApplicationRecord
   include Tiun::Model::Auth

   scope :by_credentials_or_id, ->(croi) do
      where(id: croi).or(where(settings: { name: croi }))
   end
end
