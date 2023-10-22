module DistinctBy
   extend ActiveSupport::Concern

   def self.included base
      base.class_eval do
         scope :distinct_by, -> *args do
            join_name = table.table_alias || table.name
            _selector = self.select_values.dup
            if _selector.empty?
              _selector << "ON (#{args.join(', ')}) #{join_name}.*"
            else
               selector = _selector.uniq
               selector.unshift( "ON (#{args.join(', ')}) " + selector.shift )
            end

            rela = self.distinct
            rela.select_values = selector
            rela
         end
      end
   end
end
