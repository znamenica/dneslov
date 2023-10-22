namespace :dneslov do
   namespace :image do
      desc "Synchronizes images from a source folde to target restructurizing the target image tree"
      task :proceed, [:source, :targets] => :environment do |t, args|
         ImageSyncService.new(source: args[:source], targets: args[:targets].split(":")).sync
      end

      desc "Syncronize image folders to upserver with rsync"
      task :rsync, [:source, :targets] => :environment do |t, args|
         args[:targets].split(":").each do |target|
            %x{rsync -r --exclude='lost+found' #{args[:source]}/ #{target}/ 2>&1}
         end
      end

      desc "Load resources with newly appeared scheme uris to DB"
      task :resourcesify, [:storage] => :environment do |t, args|
         ImageSyncService.new(storage: args[:storage]).import
      end

      desc "Load resources and converts them into obejcts: image_url, etc"
      task :load, [:asset_path] => :environment do |t, args|
         ImageSyncService.new(asset_path: args[:asset_path]).load
      end

      desc "Clean lastest resources and related to them links"
      task :clean do |t|
         t = (Resource.last&.created_at || Time.at(10**10)) - 5.minutes
         Resource.where("created_at >= ?", t).destroy_all
      end

      desc "MrProperize source folder"
      task :mrproper, [:source] => :environment do |t, args|
         ImageSyncService.new(source: args[:source]).cleanup
      end
   end

   namespace :calendary do
      desc "Copy calendary's memoes from sources to a target calendary defined by slug or name"
      task :copy, [:sources, :target]  => :environment do |t, args|
         CalendaryCopy.new(target: args[:target], sources: args[:sources].split(":")).do
      end
   end
end
