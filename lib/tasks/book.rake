namespace :book do
   desc "Generate calendary PDF with args"
   task :pdf, %i(name calendary dates year) => :environment do |t, args|
      Rails.logger.info "Generate PDF Book with args #{args.inspect}"

      PdfBookService.new(args).generate
   end
end
