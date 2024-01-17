#class Api::V1::UsersController < Api::CommonController
class UsersController < Api::CommonController
   after_action :send_validation_email, only: :create

   def send_validation_email
      if @object.email.no
         UserMailer.email_validation(@object).deliver
      end
   end
end
