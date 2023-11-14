require 'rdoba/roman'

module Tasks
   class << self
      def add_errors f, errors
         @errors ||= {}
         @errors[ f ] ||= [ errors ].flatten
      end

      def errors
         @errors ||= {}
      end

      def import_memo_descriptions_from calendary_slug, language_code
         descriptions = Description.desc.by_languaged_calendary(calendary_slug, language_code)
         descriptions.each do |description|
            source = description.describable.memory.description_for(language_code)
            description.update!(text: source.text) if source
         end
      end

      def fix_root_in_names
         Name.all.each do |name|
            line = [ name ]
            last = name

            while last.bond?
               last = last.bond_to
               binding.pry if !last
               line.push(last)
            end

            ids = line.map(&:id)
            root_ids = line.map(&:root_id).uniq

            if root_ids.size > 1
               Name.where(id: ids).update_all(root_id: root_ids.last)
            end
         end
      end

      def import_event_kinds
         event_kinds = YAML.load( File.open( Rails.root.join( 'db/seeds/event_kinds.yaml' )))
         event_kinds.each do |event_kind|
            Kernel.puts "#{event_kind['kind']} => #{event_kind['text']}"
            EventKind.where(event_kind).find_or_create_by!(event_kind)
         end
      end

      def import_orders
         orders = YAML.load( File.open( Rails.root.join( 'db/seeds/orders.yaml' )))
         orders.each do |order|
            Kernel.puts "#{order['slug_attributes']['order']} => #{order['notes_attributes'][0]['text']}"
            Order.create!(order)
         end
      end

      def fix_base_year
         memories = Memory.all
         # memories = Memory.where(base_year: nil)
         memories.each do |memory|
            memory.update!(base_year: memory.set_base_year)
         end

         Kernel.puts "Fixed #{memories.size} of #{Memory.count}"
      end

      def fix_memo_date
         memoes = Memo.where("date !~ ?", "^(\\d+\\.\\d+|[-+]\\d+|0)")
         memoes.each do |m|
            # binding.pry
            # Kernel.puts "#{m.date} => #{newdate}" if ! newdate
            m.update(date: m.fix_date)
         end
      end

      def fix_bind_kind_path_in_nomina
         Nomen.transaction do
            Nomen.where(bind_kind_path: nil).find_each do |n|
               begin
                  n.store_bind_kind_path!
               rescue Exception
               end
            end
         end

         failed = Nomen.where(bind_kind_path: nil).map { |n| n.name.text }

         raise failed.each {|x| puts x } if failed.any?
      end

      def fix_memo_scripta_for_scripta
         Scriptum.transaction do
            Scriptum.find_each do |s|
               begin
                  if s.memo_scripta.blank? && s.service_scripta.present?
                     s.services.find_each do |svc|
                        if svc.info.is_a?(Memo)
                           s.memo_scripta.create!(memo_id: svc.info.id, kind: "To")
                        elsif svc.info.is_a?(Memory)
                           svc.info.memos.each do |m|
                              s.memo_scripta.create!(memo_id: m.id, kind: "To")
                           end
                        else
                           raise
                        end
                     end
                  end
               end
            end
         end
      end

      def fix_links_for_calendary string, slug
         cal = Calendary.by_slug(slug).first

         Link.transaction do
            Link.where("url ~* ?", string).where(info_type: "Memory").map do |x|
               memoes_in = x.info.memos.in_calendaries(slug)
               m =
                  if memoes_in.blank?
                     memoes_tmp =
                        Event::NOTICE.map do |name|
                           x.info.events.where(kind_code: name).first&.memos
                        end.flatten.compact
                     memoried = memoes_tmp.find {|m| m.memory == x.info && m.bind_kind_code == "несвязаный" }

                     if memoried
                        memo = memoried.dup
                        memo.calendary_id = cal.id
                        memo.add_date = cal.date
                        memo.titles = memoried.titles.map(&:dup)
                        memo.memo_orders = memoried.memo_orders.map(&:dup)
                        memo
                     else
                        event = x.info.events.first
                        /(?<year_date>14\.03\.)/ =~ event.happened_at
                        year_date ||= '01.09'
                        memo = Memo.new(add_date: cal.date, year_date: year_date, calendary_id: cal.id,
                           bind_kind_code: "несвязаный", event_id: x.info.events.first.id)
                        memo.titles << Title.new(text: event.memory.short_name, alphabeth_code: "РО", language_code: "ру")
                        memo
                     end
                  else
                     memoes_in.first
                  end

               m.save!(validate: false)
               x.info_id = m.id
               x.info_type = m.model_name.name
               x.save!(validate: false)
            end
         end if cal
      end
   end
end
