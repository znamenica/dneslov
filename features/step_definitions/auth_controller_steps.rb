Допустим("есть пользователь с погонялом {string}") do |string|
   @users ||= {}
   @users[string] = {} ;end

Допустим("есть токен для пользователя {string}") do |string|
   @token = JwToken.encode(string) ;end

Допустим("есть имя описанное как:") do |string|
   attrs = YAML.load( string )
   Bukovina::Importers::Name.new( attrs ).import ;end

Если("запросим короткие имена") do
   header 'Accept', 'application/json'
   header 'Content-Type', 'application/json'
   @response = get('/short_names.json', session = { 'jwt': @token }) ;end

Если("сделаем {string} запрос к адресу {string} с параметром {string}") do |proto, address, parms|
   @response = send( proto.downcase, address, parms ) ;end

То("получим вывод:") do |string|
   answer = JSON.parse(@response.body)
   expect(answer.to_yaml.strip).to eq(string) ;end

То("заметим перенаправление на адрес {string} с ошибкою {string}") do |string, error|
   expect(@response.status).to eq(302)
   expect(@response.body).to match(/dashboard\?error=#{error}/) ;end
