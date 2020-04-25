require "active_record"
require "active_record/relation"
require "active_record/relation/query_methods.rb"

module ActiveRecord::QueryMethods
   def structurally_incompatible_values_for_or(other)
      (ActiveRecord::Relation::SINGLE_VALUE_METHODS - [:distinct, :create_with]).reject { |m| send("#{m}_value") == other.send("#{m}_value") } +
      (ActiveRecord::Relation::MULTI_VALUE_METHODS - [:eager_load, :left_outer_joins, :order, :extending, :unscope]).reject { |m| send("#{m}_values") == other.send("#{m}_values") } +
      (ActiveRecord::Relation::CLAUSE_METHODS - [:having, :where]).reject { |m| send("#{m}_clause") == other.send("#{m}_clause") } ;end;end

class Object
   def to_query key = nil
      "#{Addressable::URI.encode(key.to_param)}=#{Addressable::URI.encode(to_param.to_s)}" ;end;end
