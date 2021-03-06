require 'rdoba/roman'

module Tasks
   class << self
      def import_memo_descriptions_from calendary_slug, language_code
         descriptions = Description.desc.with_languaged_calendary(calendary_slug, language_code)
         descriptions.each do |description|
            source = description.describable.memory.description_for(language_code)
            description.update!(text: source.text) if source ;end;end

      def fix_root_in_names
         Name.all.each do |name|
            line = [ name ]
            last = name

            while last.bond?
               last = last.bond_to
               binding.pry if !last
               line.push(last) ;end

            ids = line.map(&:id)
            root_ids = line.map(&:root_id).uniq

            if root_ids.size > 1
               Name.where(id: ids).update_all(root_id: root_ids.last) ;end;end;end

      def import_event_kinds
         event_kinds = YAML.load( File.open( Rails.root.join( 'db/seeds/event_kinds.yaml' )))
         event_kinds.each do |event_kind|
            Kernel.puts "#{event_kind['kind']} => #{event_kind['text']}"
            EventKind.where(event_kind).find_or_create_by!(event_kind) ;end;end

      def import_orders
         orders = YAML.load( File.open( Rails.root.join( 'db/seeds/orders.yaml' )))
         orders.each do |order|
            Kernel.puts "#{order['slug_attributes']['order']} => #{order['notes_attributes'][0]['text']}"
            Order.create!(order) ;end;end

      def fix_base_year
         memories = Memory.all
         # memories = Memory.where(base_year: nil)
         memories.each do |memory|
            memory.update!(base_year: memory.set_base_year) ;end

         Kernel.puts "Fixed #{memories.size} of #{Memory.count}" ;end

      def fix_memo_date
         memoes = Memo.where("date !~ ?", "^(\\d+\\.\\d+|[-+]\\d+|0)")
         memoes.each do |m|
            # binding.pry
            # Kernel.puts "#{m.date} => #{newdate}" if ! newdate
            m.update(date: m.fix_date) ;end;end

      def add_errors f, errors
         @errors ||= {}
         @errors[ f ] ||= [ errors ].flatten ;end

      def errors
         @errors ||= {} ;end;end;end
