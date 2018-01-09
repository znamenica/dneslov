namespace :fix do
   desc "Fix root_id in names"
   task root_id: :environment do
      Tasks.fix_root_in_names

      true; end

   desc "Fix base year of memory"
   task base_year: :environment do
      Tasks.fix_base_year

      true; end

   desc "Fix memo dates"
   task memo_dates: :environment do
      Tasks.fix_memo_date

      true; end;end
