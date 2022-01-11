class ScriptumPolicy < ApplicationPolicy
   def all?
      !@user.nil?
   end

   def index?
      !@user.nil?
   end

   def show?
      scope.where(:id => record.id).exists? and !@user.nil?
   end

   def create?
      !@user.nil?
   end

   def update?
      !@user.nil?
   end

   def destroy?
      !@user.nil?
   end
end
