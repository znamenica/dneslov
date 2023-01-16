# copies source calendary memoes with title, and date into a target one
# ignoring already exist memoes
class CalendaryCopy
   class NoTargetError < StandardError; end

   attr_reader :target, :sources

   def initialize sources: nil, target: []
      @sources = sources
      @target = Calendary.by_slug(target).first ||
         raise(NoTargetError("No target calendary for slug #{target}"))

      $stderr.puts("target calendary is #{@target.default_title}")
   end

   def errors
      @errors ||= []
   end

   def error text
      $stderr.puts("E: #{text}")

      errors << text
   end

   def is_duplicated? memo
      memoes = Memo.where(calendary_id: memo.calendary_id,
                          event_id: memo.event_id,
                          year_date: memo.year_date)

      !!memoes.first
   end

   def has_critical_error? memo
      %i(year_date).include?(memo.errors.first&.attribute)
   end

   def memo_ins
      @memo_ins ||= Memo.in_calendaries(sources)
   end

   def other_memo_ids
      @other_memo_ids ||= memo_ins.where.not(id: parented_memo_ids).select(:id)
   end

   def parented_memo_ids
      @parented_memo_ids ||= memo_ins.where.not(bond_to_id: nil).select(:id).distinct
   end

   def memo_ids
      other_memo_ids.pluck(:id) | parented_memo_ids.pluck(:id)
   end

   def find_host_memo res, memo_in
      res.find do |r|
         r.event_id == memo_in.event_id && r.year_date == memo_in.year_date
      end || Memo.where(calendary_id: target.id,
                        event_id: memo_in.event_id,
                        year_date: memo_in.year_date).first
   end

   def memoes
      @memoes ||=
         memo_ids.reduce([]) do |res, memo_id_in|
            memo_in = Memo.find_by(id: memo_id_in)
            memo = memo_in.dup
            memo.calendary_id = target.id
            memo.descriptions = []
            memo.titles = memo_in.titles.map {|t| t.dup }
            memo.add_date = Time.zone.now.strftime("%d.%m.%Y %H:%M")
            memo.orders = memo_in.orders
            memo.services = memo_in.services.map {|s| s.dup }
            memo.service_links = memo_in.service_links.map {|s| s.dup }
            memo.links = memo_in.links.map {|l| l.dup }

            if memo_in.bond_to_id
               bond_to = Memo.find_by(id: memo_in.bond_to_id)
               memo.bond_to = find_host_memo(res, bond_to)
               binding.pry if !memo.bond_to
            end

            if memo.valid? && has_critical_error?(memo)
               $stderr.puts("W: Invalid add date for #{memo.memory.short_name}")
            end

            next res if is_duplicated?(memo) or has_critical_error?(memo) or memo.titles.blank?

            res | [memo]
         end
   end

   def do
      Memo.transaction do
         memoes.each {|m| m.save! }
         # res = Link.import(memoes, validate: false)
         # res.ids
         binding.pry
      end
   end
end
