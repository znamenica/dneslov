class Token < ApplicationRecord
   has_secure_token :code, length: 36

   belongs_to :user

   before_validation :fill_expires_at

   def fill_expires_at
      if respond_to?(:default_expires_at)
         self.expires_at ||= default_expires_at
      end
   end
end
