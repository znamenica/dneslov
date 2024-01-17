# language: ru
@api @session @controller @json
Свойство: Правач наряд
   Предыстория:
      * мрозим час на "2024-01-14 05:15:55 +0300"
      * є ужил сꙛ даными:
         | id           | 200001                                           |
         | password     | Picture8$                                        |
         | settings     | {name: "Ужил", last_name: "Пользов", sex: "m"}   |
      * є учетка для ужила "200001" сѫ даными:
         | no           | uzsilo                                           |
         | type         | Account::Uid                                     |

   @create @object
   Пример: Користник створяє наряду
      Если запытаю одсланје данех и заглавка наряде в "/api/v1/session.json":
         | no           | uzsilo                                  |
         | type         | Account::Uid                            |
         | password     | Picture8$                               |
      То добѫдꙛ кодъ поврата "200"
      #      И добѫдꙛ заглавкы "X-Refresh-Token, X-Session-Token"
      И добѫдꙛ приблизнъ изводъ:
         """
         ---
         session_token:
           type: Token::Session
           expires_at: '2024-01-14 06:15:55 +0300'
         refresh_token:
           type: Token::Refresh
           expires_at: '2024-02-14 05:15:55 +0300'
         """
         #И добѫдꙛ пустъ выводъ

   @create @object @error @401
   Пример: Користник кушає створити наряду сꙛ лъжноѫ лозинкоѫ, и не можє
      Если запытаю одсланје данех и заглавка наряде в "/api/v1/session.json":
         | no           | uzsilo                                  |
         | type         | Uid                                     |
         | password     | Picture0$                               |
      То добѫдꙛ кодъ поврата "401"
      И добѫдꙛ выводъ:
         """
         ---
         args:
           'no': uzsilo
           type: Uid
         """

   @create @object @error @401
   Пример: Користник кушає створити наряду сꙛ неєствучым ужилъм, и не можє
      Если запытаю одсланје данех и заглавка наряде в "/api/v1/session.json":
         | no           | uzsilo                                  |
         | type         | Uid                                     |
         | password     | Picture0$                               |
      То добѫдꙛ кодъ поврата "401"
      И добѫдꙛ выводъ:
         """
         ---
         args:
           'no': uzsilo
           type: Uid
         """

   @update @object
   Пример: Користник завѣряє ужила
      Если мрозим час на "2024-01-14 05:15:55 +0300"
      И єствує ужил сꙛ завѣрным токном "wwwwwww"
      И поновям дане и заглавкъ наряде в "/api/v1/session.json":
         | Authorization: | Validate wwwwwww    |
      То добѫдꙛ кодъ поврата "200"
      И добѫдꙛ приблизнъ изводъ:
         """
         ---
         session_token:
           type: Token::Session
           expires_at: '2024-01-14 06:15:55 +0300'
         refresh_token:
           type: Token::Refresh
           expires_at: '2024-02-14 05:15:55 +0300'
         """

   @update @object
   Пример: Користник поновяє дане наряде
      Если єствує ужил сꙛ поновячым токном "wwwwwwwee"
      И поновям дане и заглавкъ наряде в "/api/v1/session.json":
         | Authorization: | Refresh wwwwwwwee  |
      То добѫдꙛ кодъ поврата "200"
      И добѫдꙛ приблизнъ изводъ:
         """
         ---
         session_token:
           type: Token::Session
           expires_at: '2024-01-14 06:15:55 +0300'
         refresh_token:
           code: wwwwwwwee
           type: Token::Refresh
         """

   @update @object @error @401
   Пример: Користник не можє поновити дане наряде заради невѣрна токена
      Если єствує ужил сꙛ поновячым токном "ыыыыыы"
      И поновям дане и заглавкъ наряде в "/api/v1/session.json":
         | Authorization: | Refresh ииииии |
      То добѫдꙛ кодъ поврата "401"
      И добѫдꙛ пустъ выводъ

   @update @object @error @401
   Пример: Користник не можє поновити дане наряде заради невѣрна взора токена
      Если єствує ужил сꙛ поновячым токном "ыыыыыы"
      И поновям дане и заглавкъ наряде в "/api/v1/session.json":
         | Authorization: | Validate ыыыыыы |
      То добѫдꙛ кодъ поврата "401"
      И добѫдꙛ пустъ выводъ

   @get @object
   Пример: Користник добыває дане наряде
      Если єствує ужил сꙛ поновячым токном "ыыыыыы" и нарядным токном "wwwwwwwee"
      И запытаю добыванје из изнахоѕи "/api/v1/session.json":
         | Authorization: | Session wwwwwwwee   |
      То добѫдꙛ кодъ поврата "200"
      И добѫдꙛ приблизнъ изводъ:
         """
         ---
         session_token:
           type: Token::Session
           expires_at: '2024-01-14 06:15:55 +0300'
         refresh_token:
           type: Token::Refresh
           expires_at: '2024-02-14 05:15:55 +0300'
         """

   @delete @object
   Пример: Користник изтьрає иззначену наряду
      Если єствує ужил сꙛ поновячым токном "ыыыыыы" и нарядным токном "wwwwwwwee"
      И запытаю изтрѣнје изнахоѕи "/api/v1/session.json":
         | Authorization: | Session wwwwwwwee  |
      То добѫдꙛ кодъ поврата "200"
      И добѫдꙛ выводъ:
         """
         ---
         session_token:
           code: wwwwwwwee
           type: Token::Session
           expires_at: '2024-01-14 06:15:55 +0300'
         refresh_token:
           code: ыыыыыы
           type: Token::Refresh
           expires_at: '2024-02-14 05:15:55 +0300'
         """
      И сꙛчасна наряда не будє єствовати
