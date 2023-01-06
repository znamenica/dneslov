namespace :dneslov do
   namespace :image do
      desc "Synchronizes images from a source folde to target restructurizing the target image tree"
      task :sync, [:source, :targets] => :environment do |t, args|
         ImageSyncService.new(source: args[:source], targets: args[:targets].split(":")).sync
      end

      desc "Cleanup source folder"
      task :cleanup, [:source] => :environment do |t, args|
         ImageSyncService.new(source: args[:source]).cleanup
      end
   end

   namespace :load do
      desc "Load resources with newly appeared scheme uris to DB"
      task :resources => :environment do |t|
         ImageSyncService.new.import
      end

      desc "Load resources and converts them into obejcts: image_url, etc"
      task :images => :environment do |t|
         ImageSyncService.new.load
      end
   end
end
