module TotalSize
   include ActiveSupport::Concern

   def total_size
      model = self.name.constantize
      rela = self.except(:limit, :offset)
      pure = rela.except(:group, :order, :select, :joins, :left_outer_joins)
      types = rela.select_values.map do |x|
         /distinct on \((?<types>.*)\)/i =~ x

         types
      end.compact.join("").split(/\s*,\s*/)
      fields =
         if types.present?
            rela.select_values.map do |x|
               x.match(/^(?<f>.*) as (?:#{types.join("|")})/i)&.[](:f)
            end.compact.uniq
         end
      joins = rela.joins_values
      ojoins = rela.left_outer_joins_values

      join_list_pre = rela.select_values.map do |x|
         x.match(/(?<tab>.*)\.\w* as (?:#{types.join("|")})/i)&.[](:tab)&.strip
      end | rela.where_clause.send(:predicates).map do |p|
         p.is_a?(String) && /^(?<pre>[^\.]+)\./ =~ p

         pre
      end.compact
      join_list = join_list_pre.compact.map do |t|
         joins.find {|j| j.to_s.tableize == t }
      end.compact 

#      ojoin_list_pre = rela.select_values.map do |x|
#         x.match(/(?<tab>.*)\.\w* as (?:#{types.join("|")})/i)&.[](:tab)
#      end | rela.where_clause.send(:predicates).map do |p|
#         p.is_a?(String) && /^(?<pre>[^\.]+)\./ =~ p
#
#         pre
#      end.compact
#      ojoin_list = ojoin_list_pre.compact.map do |t|
#         ojoins.find {|j| j.to_s.tableize == t }
#      end.compact
#
#      binding.pry
      query_pre1 = join_list.blank? && pure || pure.joins(*join_list)
      query_pre2 = ojoins.blank? && query_pre1 || query_pre1.left_outer_joins(*ojoins)
      query =
         if fields
            query_pre2.select("DISTINCT ON(#{fields.join(",")}) #{model.table_name}.*")
         else
            query_pre2.select("#{model.table_name}.*")
         end
#      binding.pry
      model.connection.select_all("WITH cnt AS(#{query.to_sql}) SELECT COUNT(*) FROM cnt").rows[0][0]
   end
end
