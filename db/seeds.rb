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
