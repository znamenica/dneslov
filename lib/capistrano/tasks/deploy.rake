namespace :deploy do
   namespace :symlink do
      task :custom do
         on release_roles :all do
            fetch(:symlinks).each do |symlink|
               source_path = File.expand_path(release_path.join(symlink[ :source ]))
               link_path = File.expand_path(release_path.join(symlink[ :link ]))
               execute :ln, "-s", source_path, link_path
            end
         end
      end
   end

   task :restart do
      on release_roles :all do
         within release_path do
            with fetch(:bundle_env_variables, { RAILS_ENV: fetch(:stage) }) do
               execute "if [ -n \"$(ps aux|grep \\sruby )\" ]; then killall ruby; sleep 2; fi"
               execute :bundle, :exec, "puma -e #{fetch(:stage)}"
            end
         end
      end
   end
end
