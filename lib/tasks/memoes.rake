namespace :memoes do
   desc "Generate fast days for a calendary"
   task :fastdays, [:calendary] => :environment do |t, args|
      calendary = Calendary.where("name ~ '#{args[:calendary]}'").first
      Rails.logger.info "Generate fast days for calendary #{calendary.titles.first}"

      MemoService.new(calendary).fastday_generate
   end
end
