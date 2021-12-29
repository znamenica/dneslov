task pry: :environment do
   ActiveRecord::Base.connection

   opts = Pry::CLI.parse_options
   Pry::CLI.start(opts)
end

