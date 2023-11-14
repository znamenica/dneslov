namespace :fix do
   desc "Fix root_id in names"
   task root_id: :environment do
      Tasks.fix_root_in_names

      true
   end

   desc "Fix base year of memory"
   task base_year: :environment do
      Tasks.fix_base_year

      true
   end

   desc "Fix memo dates"
   task memo_dates: :environment do
      Tasks.fix_memo_date

      true
   end

   desc "Fix bind_kind_path in Nomina"
   task bind_kind_path: :environment do
      Tasks.fix_bind_kind_path_in_nomina

      true
   end

   desc "Fix memo_scripta for scripta"
   task memo_scripta: :environment do
      Tasks.fix_memo_scripta_for_scripta

      true
   end

   #
   # rake fix:links_for_calendary[http://martyrs.pstbi.ru/,нмр]
   desc "Fix memoes for calendary from another"
   task :links_for_calendary, [:string, :slug]  => :environment do |t, args|
      Tasks.fix_links_for_calendary(args[:string], args[:slug])

      true
   end
end
