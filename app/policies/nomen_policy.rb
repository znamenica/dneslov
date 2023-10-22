class NomenPolicy < ApplicationPolicy
   def all?
      !@user.nil?
   end
end
