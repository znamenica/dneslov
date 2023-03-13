# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
#


if Order.all.blank?
   ::Tasks.import_orders
end

if Subject.all.blank?
   data = YAML.load(IO.read(Rails.root.join('db/seeds/subjects.yaml')))
   models = data.map { |attrs| Subject.create!(attrs) }
end

unless Subject.find_by(key: 'МХ')
   langs = YAML.load(IO.read(Rails.root.join('db/seeds/languages.yaml')))
   models = langs.map { |attrs| Subject.new(attrs) }
   # fix cps
   AL_MAP = {
     "СР": "СЕ",
     "РУ": "РО",
     "РП": "РУ",
   }

   Subject.transaction do
      Subject.import(models, recursive: true)
      %w(Calendary Name Scriptum Service Description Link).each do |model_name|
         model = model_name.constantize
         AL_MAP.each do |src, tgt|
            model.where(alphabeth_code: src).update_all(alphabeth_code: tgt)
         end
      end
      AL_MAP.each { |src, tgt| Subject.where(key: src).update_all(key: tgt) }
   end
end
