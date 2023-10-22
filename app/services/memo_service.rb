class MemoService
   attr_reader :calendary, :add_date

   MAP = {
      slug: "спас",
      event_kind_code: "Betraial",
      order: "Спаситель",
      ranges: {
         (10..341) => {
            step: 7,
            titles: {
               ру_РУ: "Среда \#{week}-я по Пасхе"
            }
         },
         (12..341) => {
            step: 7,
            titles: {
               ру_РУ: "Пятница \#{week}-я по Пасхе"
            }
         },
         #4.04/22.03 
         (57..98) => {
            step: 1,
            condition: '<29.06',
            titles: {
               ру_РУ: "\#{weekday} \{week}-я Петрова поста"
            }
         },
         ('01.08'..'14.08') => {
            step: 1,
            titles: {
               ру_РУ: "\{day}-й день Успенского поста"
            }
         },
         ('01.08'..'14.08') => {
            step: 1,
            titles: {
               ру_РУ: "\{day}-й день Рождественского поста"
            }
         },
         ('01.08'..'14.08') => {
            step: 1,
            titles: {
               ру_РУ: "\#{weekday} \{week}-я Великого поста"
            }
         },
         ('01.08'..'14.08') => {
            step: 1,
            titles: {
               ру_РУ: "\{day}-й день Страстного поста"
            }
         }
      }
   }

   def initialize calendary, add_date = Time.now.strptime("%d.%m.%Y %H:%M")
      @calendary = calendary
      @add_date = add_date
   end

   def fastday_generate
      memoes = []

      MAP.each do |scheme|
         event = Event.where(memory_id: Slug.where(text: scheme.slug).first.sluggable.id,
                             kind_code: scheme.event_kind_code).first
         scheme.ranges.each do |range, data|
            range.step(7) do |indent|
               week = indent / 7 + 1
               titles =
                  data.map do |(lang, text_in)|
                     /#{language_code}_#{alphabeth_code}/ =~ lang
                     text = eval(text_in)
                     Title.new(language_code: language_code,
                               alphabeth_code: alphabeth_code,
                               text: text)
                  end

               memoes << Memo.new(add_date: add_date,
                                  year_date: "+#{indent}",
                                  calendary_id: calendary.id,
                                  event_id: event.id,
                                  titles: titles)
            end
         end
      end

      binding.pry
      Book.import(memoes)
   end
end
