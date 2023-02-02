require 'yaml'
require 'active_support/time_with_zone'

class ImageSyncService
   attr_reader :targets, :source

   def initialize source: nil, targets: []
      @source = source # path
      @targets = targets # paths
   end

   def folders
      Dir["#{source}/*"].select {|d| File.directory?(d) }
   end

   def source_files_for folder
      Dir.chdir(folder) do
         Dir["**/*"].select {|d| File.file?(d) }
      end
   end

   def scheme
      return @scheme if @scheme

      @scheme ||= {
         targets: targets,
         source: source,
         scheme_path: scheme_path,
         attrs: attrs,
         date: now,
      }
   end

   def now
      @now ||= Time.zone.now
   end

   def scheme_path
      @scheme_path ||= File.join('.schemes', now.strftime("%Y"), now.strftime("%m"), now.strftime("%Y%m%d%H%M%S"))
   end

   def errors
      @errors ||= []
   end

   def error text
      $stderr.puts("E: #{text}")

      errors << text
   end

   def warns
      @warns ||= []
   end

   def warn text
      $stderr.puts("W: #{text}")

      warns << text
   end

   def attrs
      @attrs ||=
         folders.map do |folder|
            fbase = File.basename(folder)
            target_path = File.join(fbase[0], fbase.gsub(/\s+/, '')[0..1], fbase)

            source_files_for(folder).map do |file_in|
               target_filename = reext(File.basename(file_in), 'webp')
               event = file_in.split('/')[0..-2].first
               file = File.join(folder, file_in)
               type, imageinfo, fileinfo, kind, width, height = Dir.chdir(folder) { info(file_in) }
               warn("Erroneous file's #{file} type is #{fileinfo}") unless type

               {
                  type: type,
                  target_path: target_path,
                  event: event,
                  target: File.join(target_path, target_filename),
                  short_name: fbase,
                  comment: reext(File.basename(file)),
                  source: file,
                  imageinfo: imageinfo,
                  fileinfo: fileinfo,
                  kind: kind,
                  width: width,
                  height: height
               }
            end
         end.flatten
   end

   def info file
      imageinfo = `identify '#{esc(file)}' 2>&1`.strip
      fileinfo = `file '#{esc(file)}'`.strip

      unless /(?<type>GIF|JPEG|WEBP|PNG) (?<width>\d+)x(?<height>\d+)/ =~ imageinfo
         case fileinfo
         when /UTF-8 Unicode text/
            type = 'text'
         end
      end

      kind = !width && :nonimage ||
         width == height && (height.to_i < 1000 && :thumb || :both) ||
         height.to_i < 1000 && :invalid || :icon

      [type&.downcase&.to_sym, imageinfo, fileinfo, kind, width.to_i, height.to_i]
   end

   def reext file, ext = nil
      [ /^(?<pure_name>.*)\.[^.]*$/ =~ file && pure_name || file, ext].compact.join(".")
   end

   def assign_comment target_file, text, scheme
      scheme[:attrs].select {|a| a[:target] == target_file }.each {|a| a[:comment] += "\n" + text }
   end

   def esc string
      string.gsub("'", "\\'")
   end

   # copying source to target converting if required
   def copy source, target, type, kind, scheme
      FileUtils.mkdir_p(File.dirname(target))

      log =
         case type
         when :jpeg
            `cwebp -q 90 '#{esc(source)}' -o '#{esc(target)}' 2>&1`
         when :png
            `cwebp -lossless -z 9 -m 6 '#{esc(source)}' -o '#{esc(target)}' 2>&1`
         when :gif
            `gif2webp '#{esc(source)}' -o '#{esc(target)}' 2>&1`
         when :webp
            if kind == :icon
               `convert '#{esc(source)}' -resize 300x300 '#{esc(target)}' 2>&1`
            else
               FileUtils.cp(source, target)
            end
         when :text
            assign_comment(target, IO.read(source), scheme)
         else
            $stderr.puts("Skip file #{source} with null type")
         end
   rescue
      binding.pry
   end

   def sum target
      `gost12sum '#{target}' 2>&1`.split(/\s+/).first.strip
   end

   # synchronize source to targets
   def sync
      return if validates(scheme).size > 0

      targets.each do |t|
         scheme_file = File.join(t, scheme[:scheme_path] + '.yaml')
         FileUtils.mkdir_p(File.dirname(scheme_file))

         scheme[:attrs].each do |a|
            file = File.join(t, a[:target])
            copy(a[:source], file, a[:type], a[:kind], scheme)
            a[:hash] = sum(file)
         end

         File.open(scheme_file, "w+") {|f| f.puts(scheme.to_yaml) }
      end

      self
   end

   def short_names
      @short_names ||= {}
   end

   def memory_for short_name
      short_names[short_name] ||= Memory.find_by(short_name: short_name)
   end

   def duped a
      a[:type] != :text && scheme[:attrs].select do |b|
         a[:target] == b[:target] && b[:type] != :text
      end || []
   end

   def validates scheme
      scheme[:attrs].each do |a|
         duped = duped(a)

         error("Invalid height of image file #{a[:source]}") if a[:kind] == :invalid
         error("Invalid short name: #{a[:short_name]}") unless memory_for(a[:short_name])
         error("Duplicate file names are: #{duped.map { |b| a[:source]}.join(', ')}") if duped.size > 1
      end

      errors
   end

   # cleanup the source
   def cleanup
      scheme[:attrs].each { |a| FileUtils.rm_f(a[:source]) }
      folders.each { |f| FileUtils.rm_r(f) }

      self
   end

   KEYS = %i(short_name comment imageinfo fileinfo kind width height hash)
   #
   # import resources from file to db
   def import
      time = Resource.order(updated_at: :desc).first&.updated_at || Time.at(0) # last for updated_at or settingize
      storage = "public/images" # TODO settingsize
      resource_path = Rails.root.join(storage)

      scheme_files =
         Dir.chdir(resource_path) do
            Dir['.schemes/**/*.yaml'].select do |f|
               Time.parse(f.match(/\/(?<time>\d+)\./)[:time]) > time
            end
         end

      attrs =
         scheme_files.map do |scheme_file|
            scheme =
               YAML.load(IO.read(File.join(resource_path, scheme_file)),
                  permitted_classes: [ActiveSupport::TimeWithZone, ActiveSupport::TimeZone, Time, Symbol])

            scheme[:attrs].map do |a|
               props = KEYS.reduce({ storage: storage }) { |r, key| r.merge(key => a[key]) }
               { path: a[:target], props: props }
            end
         end.flatten

      Resource.import(attrs)
   end

   def description_attrs_for resource
      language, alphabeth = Languageble.la_for_string(resource[:props]['comment'])

      {
         language_code: language,
         alphabeth_code: alphabeth,
         text: resource[:props]['comment']
      }
   end

   def events
      @events ||= {}
   end

   def event_for event_name
      events[event_name] ||= info.events.by_token('рождество').first
   end

   # load resources and converts them into obejcts: image_url etc
   def load
      unassigned = Resource.unassigned.image
      objects =
         unassigned.map do |r|
            info = Memory.find_by(short_name: r[:props]['short_name'])
            error("Invalid short name: #{r[:props]['short_name']}") unless info

            target =
               if r[:props]['sub_kind'] && info
                  event = event_for(r[:props]['sub_kind'])

                  binding.pry if !event
                  error("Invalid event #{r[:props]['sub_kind']} for short name #{r[:props]['short_name']}") unless event
                  event
               else
                  info
               end

            attrs = {
               url: File.join("/images", r.path),
               # url: File.join("https://dneslov.org/images", r.path),
               info: target,
               language_code: 'ру',
               alphabeth_code: 'РУ',
               descriptions_attributes: [description_attrs_for(r)],
               resource_id: r.id
            }

            case r[:props]['kind']
            when 'thumb'
               ThumbLink.new(attrs)
            when 'icon'
               IconLink.new(attrs)
            when 'both'
               [ThumbLink.new(attrs),
                IconLink.new(attrs)]
            when 'nonimage'
            else
               error("Invalid kind #{r[:props]['kind']} for short name #{r[:props]['short_name']}")
            end
         end.compact.flatten

      Link.transaction do
         res = Link.import(objects, validate: false)
         # res.ids
      end if errors.blank?
   end
end
