# frozen_string_literal: true

require 'prawn'
require 'redcarpet'
require 'open-uri'

# PDF autogeneration service class based on the argument options
#
class PdfBookService
   attr_reader :options

   FONTS = {
      'PTAstraSerif' => {
         normal: Rails.root.join('public/fonts/PTAstraSerif-Regular.ttf').to_s,
         bold: Rails.root.join('public/fonts/PTAstraSerif-Bold.ttf').to_s,
         italic: Rails.root.join('public/fonts/PTAstraSerif-Italic.ttf').to_s,
         bold_italic: Rails.root.join('public/fonts/PTAstraSerif-BoldItalic.ttf').to_s,
      }
   }.freeze

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
      @memoes ||=
         begin
            rela = Memo.all
            rela = rela.by_date(dates) if dates
            rela = rela.where(calendary_id: calendary.id) if calendary

            rela
         end
   end

   def grouped
      @grouped ||= memoes.group_by { |m| m.year_date_for(year) }.sort_by { |(date, _)| date }
   end

   def name
      @name ||= options[:name] || 'memories.pdf'
   end

   def markdown
      @markdown ||= Redcarpet::Markdown.new(Redcarpet::Render::HTML)
   end

   def rendered desc
      markdown.render(desc.to_s).gsub(%r{</?p>}, '')
   end

   def pdf
      @pdf ||= Prawn::Document.new
   end

   def generate
      draw_head
      draw_memoes
      pdf.render_file(name)
   end

   private

   def draw_memoes
      grouped.each do |(date, date_memoes)|
         memo = date_memoes.reject { |m| m.descriptions.empty? }.first
         next if !memo

         title = memo.titles.first.text
         desc = memo.descriptions.first.text
         icon_link = memo.memory.icon_links.first

         pdf.start_new_page
         pdf.text(I18n.localize(date.to_date, format: '%e %B'), size: 15, align: :right)

         icon_link&.valid? ? draw_iconed(title, desc, icon_link) : draw_plain(title, desc)
      end
   end

   def draw_head
      pdf.font_families.update(FONTS)
      pdf.font 'PTAstraSerif'

      pdf.text_box("Календарь Днеслов\nПечатная версия", size: 25, align: :center, width: 500)
   end

   def draw_iconed title, desc, icon_link
      pdf.span(450, position: :center) do
         pdf.text(title.to_s, size: 15)
         y_position = pdf.cursor - 20
         excess_text = pdf.text_box(
            rendered(desc),
            width: 244,
            height: 244,
            at: [0, y_position],
            inline_format: true
         )
         pdf.bounding_box([250, y_position], width: 200, height: 240) do
            pdf.image(URI.parse(icon_link.url).open, fit: [200, 240])
         end
         pdf.text(excess_text, width: 450, inline_format: true)
      end
   end

   def draw_plain title, desc
      pdf.span(450, position: :center) do
         pdf.text(title.to_s, size: 15, width: 400)
         pdf.move_down(20)
         pdf.text(rendered(desc), inline_format: true)
      end
   end
end
