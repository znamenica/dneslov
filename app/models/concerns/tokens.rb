module Tokens
   extend ActiveSupport::Concern

   def self.included base
      base.class_eval do
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
            self.merge(or_rel).distinct
         end

         singleton_class.send(:alias_method, :q, :by_tokens)
      end
   end
end
