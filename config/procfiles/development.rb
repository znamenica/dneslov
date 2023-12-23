web: PORT=33333 RAILS_ENV=development bundle exec puma -C config/puma.rb
worker: bundle exec sidekiq -C config/sidekiq.yml
watch: yarn run start
