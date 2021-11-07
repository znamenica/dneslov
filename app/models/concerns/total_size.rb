module TotalSize
   include ActiveSupport::Concern

   def join_wheres dep
      #      binding.pry
      case dep
      when String
         /^(?<pre>[^\.]+)\./ =~ dep
         pre || dep
      when Arel::Nodes::In
         dep.left.relation.name
      end
   end

   def to_joins dep
      case dep
      when ActiveRecord::Associations::JoinDependency
         dep.send(:join_root).base_klass.table_name
      when String
         /JOIN\s*(?<tbl>\w+)/ =~ dep
         tbl && tbl || dep
      else
         dep.to_s.tableize
      end
   end

   def proceed_joins joins, default_type = :inner
      joins.reduce({}) do |res, join|
         _outer = false

         name =
            case join
            when Symbol
               join
            when String
               /(?<_outer>LEFT OUTER )?JOIN (?<_table>\w+)( AS (?<_alias>\w+))?/ =~ join
               _alias || _table
            end
         type = _outer.nil? && :inner || _outer && :left_outer || default_type

         res[name] = { join: join, type: type }

         res
      end
   end

   def total_size
      model = self.name.constantize
      rela = self.except(:limit, :offset)
      pure = rela.except(:group, :order, :select, :joins, :left_outer_joins)
      types = rela.select_values.reduce([]) do |res, x|
         case x
         when /ON \((.*)\)/i
            res | $1.split(/\s*,\s*/)
         when /(?<field>[^\s]*) AS (?<match>#{res.join("|")})/i
            res.map {|x| x == $2 && $1 || x }
         else
            res
         end
      end
      fields = types
#         if types.present?
#            rela.select_values.map do |x|
#               x.match(/^(?<f>.*) as (?:#{types.join("|")})/i)&.[](:f)
#            end.compact.uniq
#         end || []
      joins = rela.joins_values
      ojoins = rela.left_outer_joins_values
      joins1 = proceed_joins(rela.joins_values)
      ojoins1 = proceed_joins(rela.left_outer_joins_values, :left_outer)

      #binding.pry
      req_wheres_pre1 = rela.where_clause.send(:predicates).map do |x|
         case x
         when Arel::Nodes::In
            x.left.relation.name
         when Arel::Nodes::Grouping
            res = []
            while x.expr.is_a?(Arel::Nodes::Or) do
               res << x.expr.left.children.first.expr
               x = x.expr.right.children.first
            end
         when String
            x
         end
      end.compact.uniq
      req_wheres_pre = rela.where_clause.send(:predicates).map do |p|
         p.chain.select do |node|
            node.is_a?(Arel::Nodes::Grouping) && node.expr.is_a?(String)
         end.map do |node|
            /^(?<field>[\w\.]+)/.match(node.expr).[](:field).split(".").first
         end.uniq.map do |node|
            join_wheres(node)
         end if p.respond_to?(:chain)
      end.flatten.compact.uniq
      req_wheres = (((req_wheres_pre | req_wheres_pre1) - [self.table_name]) | fields).map {|x| x.split(".").first || x }.uniq

      join_list_pre = rela.select_values.map do |x|
         x.match(/(?<tab>.*)\.\w* as (?:#{types.join("|")})/i)&.[](:tab)&.strip
      end.compact | rela.where_clause.send(:predicates).map do |p|
         join_wheres(p)
      end.compact - [self.table_name]
      join_list = join_list_pre.compact.map do |t|
         req_wheres.find {|j| to_joins(j) == t.to_s }
      end.uniq.compact
      #outer_join_list = ojoins.map do |t|
      #   req_wheres.find {|j| to_joins(j) == t.to_s }
      #end.uniq.compact

      aa = rela.arel.source.select {|x|x.is_a?(Arel::Nodes::OuterJoin)}.map {|x| x }
      outer_aliases = aa.reduce({}) {|r,x| rr = x.left.respond_to?(:right) && x.left.right || nil; rr && r[rr] = x;r }

      reflections = self.reflections.values.map { |ref| [ ref.klass.table_name, ref ] }.to_h.merge(outer_aliases)
      orefls = ojoins
      #orefls1 = outer_join_list.map do |j|
      #   ref = reflections[to_joins(j)]
      #   ref.respond_to?(:source_reflection_name) && ref.source_reflection_name || ref&.name
      #end.compact

      refls = (join_list | req_wheres & outer_aliases.keys).map do |j|
         ref = reflections[to_joins(j)]
         case ref
         when ActiveRecord::Reflection::AbstractReflection
            ref.respond_to?(:source_reflection_name) && ref.source_reflection_name || ref&.name
         when Arel::Nodes::OuterJoin
            ref
         end
      end.compact - orefls


#      binding.pry
      ########################################
      #

#      join_list_pre = rela.select_values.map do |x|
#         x.match(/(?<tab>.*)\.\w* as (?:#{types.join("|")})/i)&.[](:tab)&.strip
#      end | rela.where_clause.send(:predicates).map do |p|
#         join_wheres(p)
#      end.compact - [self.table_name]
#      join_list = join_list_pre.compact.map do |t|
#         #joins.map {|j| to_joins(j) }.uniq.find {|j| j == t }
#         joins.find {|j| to_joins(j) == t }
#      end.compact.reject { |x| ojoins.include?(x.to_sym) }
#
##      ojoin_list_pre = rela.select_values.map do |x|
##         x.match(/(?<tab>.*)\.\w* as (?:#{types.join("|")})/i)&.[](:tab)
##      end | rela.where_clause.send(:predicates).map do |p|
##         p.is_a?(String) && /^(?<pre>[^\.]+)\./ =~ p
##
##         pre
##      end.compact
##      ojoin_list = ojoin_list_pre.compact.map do |t|
##         ojoins.find {|j| j.to_s.tableize == t }
##      end.compact
##
#      binding.pry
#      query_pre1 = join_list.blank? && pure || pure.joins(*join_list)
#      query_pre2 = ojoins.blank? && query_pre1 || query_pre1.left_outer_joins(*ojoins)
#      binding.pry
      query_pre1 = refls.blank? && pure || pure.joins(*refls)
      query_pre2 = orefls.blank? && query_pre1 || query_pre1.left_outer_joins(*orefls)
      query =
         if fields.present?
            query_pre2.distinct.select("ON(#{fields.join(",")}) #{model.table_name}.*")
         else
            query_pre2.select("#{model.table_name}.*")
         end
      # binding.pry
      model.connection.select_all("WITH cnt AS(#{query.to_sql}) SELECT COUNT(*) FROM cnt").rows[0][0]
   end
end
