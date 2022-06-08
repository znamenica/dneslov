require "prawn"
require "redcarpet"
require "open-uri"

class PDFBookService
   attr_reader :options

   def calendary
      @calendary ||= Calendary.by_token(options[:calendary]).first
   end

   def initialize options
      @options = options
   end

   def year
      options[:year]&.to_i || Date.today.year
   end

   def dates
      options[:dates]&.split(/[;,]/)
   end

   def memoes
      @memoes ||= (
         rela = Memo.all
         rela = rela.by_date(dates) if dates
         rela = rela.where(calendary_id: calendary.id) if calendary

         rela
      )
   end

   def grouped
      @grouped ||= memoes.group_by {|m| m.year_date_for(year) }.sort_by {|(date, _)| date }
   end

   def name
      @name ||= options[:name] || "memories.pdf"
   end

   def markdown
      @markdown ||= Redcarpet::Markdown.new(Redcarpet::Render::HTML, extensions = {})
   end

   def generate
      Prawn::Document.generate(name) do |pdf|
         pdf.font_families.update("FiraSlav" => {
            :normal => Rails.root.join("public/fonts/PTAstraSerif-Regular.ttf").to_s,
            :bold => Rails.root.join("public/fonts/PTAstraSerif-Bold.ttf").to_s,
            :italic => Rails.root.join("public/fonts/PTAstraSerif-Italic.ttf").to_s,
            :bold_italic => Rails.root.join("public/fonts/PTAstraSerif-BoldItalic.ttf").to_s,
         })
         pdf.font "FiraSlav"

         pdf.text_box("Календарь Днеслов\nПечатная версия", size: 25, align: :center, width: 500)
         grouped.each do |(date, date_memoes)|
            memo = date_memoes.reject {|m| m.descriptions.empty? }.first
            next if !memo

            title = memo.titles.first.text
            desc = memo.descriptions.first.text

            pdf.start_new_page
            pdf.text(I18n.localize(date.to_date, format: "%e %B"), size: 15, align: :right)
            rendered = markdown.render(desc.to_s).gsub(/<\/?p>/, '')
            icon_link = memo.memory.icon_links.first

            if icon_link && icon_link.valid?
               pdf.span(450, position: :center) do
                  pdf.text(title.to_s, size: 15)
                  y_position = pdf.cursor - 20
                  excess_text = pdf.text_box(
                     rendered,
                     width: 242,
                     height: 242,
                     overflow: :truncate,
                     at: [0, y_position],
                     inline_format: true
                  )
                  pdf.bounding_box([250, y_position], width: 200, height: 240) do
                     pdf.image(URI.open(icon_link.url), fit: [200, 240])
                  end
                  pdf.text(
                     excess_text,
                     width: 450,
                     inline_format: true
                  )
               end
            else
               pdf.span(450, position: :center) do
                  pdf.text(title.to_s, size: 15, width: 400)
                  pdf.move_down(20)
                  pdf.text(rendered, inline_format: true)
               end
            end
         end
      end
   end
end
