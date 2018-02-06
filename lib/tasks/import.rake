namespace :db do
   namespace :import do
      namespace :memo do
         desc "Fix root_id in names"
         task :descriptions, [:calendary, :language_code] => :environment do |t, args|
            Tasks.import_memo_descriptions_from(args[:calendary], args[:language_code])

            true; end;end;end;end
