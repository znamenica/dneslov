class Account < ApplicationRecord
   include Tiun::Model::Account

   validates :no, uniqueness: { scope: :type }
end
