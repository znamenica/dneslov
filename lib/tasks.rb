require 'rdoba/roman'

module Tasks
   class << self
      def import_event_kinds
         event_kinds = YAML.load( File.open( Bukovina.root.join( 'db/seeds/event_kinds.yaml' )))
         event_kinds.each do |event_kind|
            Kernel.puts "#{event_kind['kind']} => #{event_kind['text']}"
            EventKind.where(event_kind).find_or_create_by!(event_kind) ;end;end

      def import_orders
         orders = YAML.load( File.open( Bukovina.root.join( 'db/seeds/orders.yaml' )))
         orders.each do |order|
            Kernel.puts "#{order['order']} => #{order['text']}"
            Order.where(order).find_or_create_by!(order) ;end;end

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
