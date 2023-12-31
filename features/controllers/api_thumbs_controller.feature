# language: ru
@api @thumb @controller @json
Свойство: Правач личинок
   Предыстория:
      * єствує памѧть "Памѧтно"
      * єствує личинка сѫ даными:
         | id              | 200001                                     |
         | uid             | 6b9e05cf-aabc-4dc3-97f7-4abd70d6f053       |
         | thumbable_name  | Памѧтно                                    |
         | thumb_path      | features/fixtures/300x300-green.webp       |
      * єствує сꙛбытие "Сꙛбытие" сꙛ озом "200201" ѫ памѧти "Памѧтно"
      * єствує личинка сѫ даными:
         | id              | 200002                                     |
         | uid             | 6b9e05cf-aabc-4dc3-97f7-4abd70d6f054       |
         | thumbable_name  | Памѧтно#Сꙛбытие                            |
         | thumb_path      | features/fixtures/400x400-transparent.png  |
      * єствує сꙛбытие "Сꙛбытко" сꙛ озом "200202" ѫ памѧти "Памѧтно"
      * єствує личинка сѫ даными:
         | id              | 200003                                     |
         | uid             | 6b9e05cf-aabc-4dc3-97f7-4abd70d6f055       |
         | thumbable_name  | Памѧтно#200202                             |
         | thumb_path      | features/fixtures/500x500-blue.webp        |

   @get @collection
   Пример: Запрос к контроллеру личинок в АПИ при отсутствии личинок
      Пусть не єствує ни єдне личинке
      Если сдѣлаю "GET" запытъ до адреса "/api/v1/thumbs.json"
      То добѫдꙛ кодъ поврата "204"

   @get @collection
   Пример: Запрос к контроллеру личинок в АПИ
      Пусть єствує "1" личинка
      Если сдѣлаю "GET" запытъ до адреса "/api/v1/thumbs.json"
      То добѫдꙛ кодъ поврата "200"

   @get @collection
   Пример: Користник добыває списъ личинок
      Если запытаю добыванје из изнахоѕи "/api/v1/thumbs.json"
      То добѫдꙛ кодъ поврата "200"
      И добѫдꙛ вывод:
         """
         ---
         - uid: 6b9e05cf-aabc-4dc3-97f7-4abd70d6f053
           url: "/thumbs/6b9e05cf-aabc-4dc3-97f7-4abd70d6f053.webp"
           thumbable_name: Памѧтно
         - uid: 6b9e05cf-aabc-4dc3-97f7-4abd70d6f054
           url: "/thumbs/6b9e05cf-aabc-4dc3-97f7-4abd70d6f054.webp"
           thumbable_name: Памѧтно#200201
         - uid: 6b9e05cf-aabc-4dc3-97f7-4abd70d6f055
           url: "/thumbs/6b9e05cf-aabc-4dc3-97f7-4abd70d6f055.webp"
           thumbable_name: Памѧтно#200202
         """
      А добѫдꙛ охватъ "0-9/3"
      И добѫдꙛ длину охвата "3"

   @get @collection
   Пример: Запрос постраничный к контроллеру личинок в АПИ
      Если сдѣлаю "GET" запытъ до адреса "/api/v1/thumbs.json" сꙛ доводом "per=2"
      То добѫдꙛ кодъ поврата "206"
      И добѫдꙛ приблизнъ извод:
         """
         ---
         - uid: 6b9e05cf-aabc-4dc3-97f7-4abd70d6f053
           url: "/thumbs/6b9e05cf-aabc-4dc3-97f7-4abd70d6f053.webp"
           thumbable_name: Памѧтно
         - uid: 6b9e05cf-aabc-4dc3-97f7-4abd70d6f054
           url: "/thumbs/6b9e05cf-aabc-4dc3-97f7-4abd70d6f054.webp"
           thumbable_name: Памѧтно#200201
         """
      А добѫдꙛ охватъ "0-1/3"
      И добѫдꙛ длину охвата "2"
      Если сдѣлаю "GET" запытъ до адреса "/api/v1/thumbs.json" сꙛ доводом "per=2&page=2"
      То добѫдꙛ кодъ поврата "200"
      И добѫдꙛ приблизнъ извод:
         """
         ---
         - uid: 6b9e05cf-aabc-4dc3-97f7-4abd70d6f055
           url: "/thumbs/6b9e05cf-aabc-4dc3-97f7-4abd70d6f055.webp"
           thumbable_name: Памѧтно#200202
         """
      А добѫдꙛ охватъ "2-3/3"
      И добѫдꙛ длину охвата "1"

   @get @collection @error @416
   Пример: Запрос к контроллеру картинок в АПИ
      Если сдѣлаю "GET" запытъ до адреса "/api/v1/thumbs.json" сꙛ доводом "page=111111"
      То добѫдꙛ кодъ поврата "416"
      И добѫдꙛ приблизнъ извод:
         """
         ---
         args:
           page: '111111'
         """

   @get @collection @error @416
   Пример: Запрос к контроллеру картинок в АПИ
      Если сдѣлаю "GET" запытъ до адреса "/api/v1/thumbs.json" сꙛ заглавјем:
         """
         ---
         Range: records=100000-200000
         """
      То добѫдꙛ кодъ поврата "416"
      И добѫдꙛ приблизнъ извод:
         """
         ---
         args: {}
         """


   @create @object
   Пример: Користник створяє личинку
      Если запытаю створенје изнахоѕи личинци "/api/v1/thumbs/create.json" сꙛ даными:
         | uid             | 6b9e05cf-aabc-4dc3-97f7-4abd70d6f059 |
         | thumb_path      | features/fixtures/301x301-yellow.bmp |
         | thumbable_name  | Памѧтно                              |
      То добѫдꙛ кодъ поврата "200"
      И добѫдꙛ вывод:
         """
         ---
         uid: 6b9e05cf-aabc-4dc3-97f7-4abd70d6f059
         url: "/thumbs/6b9e05cf-aabc-4dc3-97f7-4abd70d6f059.webp"
         thumbable_name: Памѧтно
         event_did:
         memory_short_name: Памѧтно
         """
      И изнахоѕь личинци для "Памѧтно" бѫдє яко:
         """
         ---
         uid: 6b9e05cf-aabc-4dc3-97f7-4abd70d6f059
         url: "/thumbs/6b9e05cf-aabc-4dc3-97f7-4abd70d6f059.webp"
         thumb: "/thumbs/6b9e05cf-aabc-4dc3-97f7-4abd70d6f059.webp"
         thumbable_name: Памѧтно
         event_did:
         memory_short_name: Памѧтно
         """

   @create @object @error @422
   Пример: Користник кушає створити подвојну личинку, и не можє.
           Излетає бо изключеие ActionController::ParameterMissing
      Если єствує сꙛбытие "Сꙛбытково" сꙛ озом "200203" ѫ памѧти "Памѧтно"
      И запытаю створенје изнахоѕи личинци "/api/v1/images/create.json" сꙛ даными:
         | uid             | 6b9e05cf-aabc-4dc3-97f7-4abd70d6f064 |
         | thumb_path      | features/fixtures/300x300-green.webp |
         | thumbable_name  | Памѧтно#200203                       |
      То добѫдꙛ кодъ поврата "422"
      И добѫдꙛ вывод:
         """
         ---
         args: {}
         error: 'param is missing or the value is empty: picture'
         """
      А изнахоѕи личинци "Памѧтно#200203" не бѫдє

   @create @object @error @422
   Пример: Користник кушає створити подвојну личинку, и не можє
      Если єствує сꙛбытие "Сꙛбытково" сꙛ озом "200203" ѫ памѧти "Памѧтно"
      И запытаю створенје изнахоѕи личинци "/api/v1/thumbs/create.json" сꙛ даными:
         | uid             | 6b9e05cf-aabc-4dc3-97f7-4abd70d6f064 |
         | thumb_path      | features/fixtures/300x300-green.webp |
         | thumbable_name  | Памѧтно#200203                       |
      То добѫдꙛ кодъ поврата "422"
      И добѫдꙛ вывод:
         """
         ---
         args: {}
         error:
           digest:
           - has already been taken
         """
      А изнахоѕи личинци "Памѧтно#200203" не бѫдє

   @create @object @error @422
   Пример: Користник кушає створити малу личинку, и не можє
      Если єствує сꙛбытие "Сꙛбытково" сꙛ озом "200203" ѫ памѧти "Памѧтно"
      И запытаю створенје изнахоѕи личинци "/api/v1/thumbs/create.json" сꙛ даными:
         | uid             | 6b9e05cf-aabc-4dc3-97f7-4abd70d6f064 |
         | thumb_path      | features/fixtures/canvas.jpg         |
         | thumbable_name  | Памѧтно#200203                       |
      То добѫдꙛ кодъ поврата "422"
      И добѫдꙛ вывод:
         """
         ---
         args: {}
         error:
           thumb:
           - has 100 px. height less than 300 px.
         """
      А изнахоѕи личинци "Памѧтно#200203" не бѫдє

   @update @object @error @404
   Пример: Користник поновяє дане личинке
      Если запытаю одсланје личинке в изнаходь "/api/v1/thumbs/6b9e05cf-aabc-4dc3-97f7-4abd70d6f053.json" сꙛ даными:
         | uid             | 6b9e05cf-aabc-4dc3-97f7-4abd70d6f060 |
         | thumb_path      | features/fixtures/301x301-yellow.bmp |
         | thumbable_name  | Памѧтно#200202                       |
      То добѫдꙛ кодъ поврата "200"
      И добѫдꙛ вывод:
         """
         ---
         uid: 6b9e05cf-aabc-4dc3-97f7-4abd70d6f060
         url: "/thumbs/6b9e05cf-aabc-4dc3-97f7-4abd70d6f060.webp"
         thumbable_name: Памѧтно#200202
         event_did: 200202
         memory_short_name: Памѧтно
         """
      Если запытаю добыванје из изнахоѕи "/api/v1/thumbs/6b9e05cf-aabc-4dc3-97f7-4abd70d6f060.json"
      То добѫдꙛ кодъ поврата "200"
      И добѫдꙛ вывод:
         """
         ---
         uid: 6b9e05cf-aabc-4dc3-97f7-4abd70d6f060
         url: "/thumbs/6b9e05cf-aabc-4dc3-97f7-4abd70d6f060.webp"
         thumbable_name: Памѧтно#200202
         event_did: 200202
         memory_short_name: Памѧтно
         """
      Если запытаю добыванје из изнахоѕи "/api/v1/thumbs/6b9e05cf-aabc-4dc3-97f7-4abd70d6f053.json"
      То добѫдꙛ кодъ поврата "404"
      И добѫдꙛ вывод:
         """
         ---
         args:
           uid: 6b9e05cf-aabc-4dc3-97f7-4abd70d6f053
         """

   @update @object @error @422
   Пример: Користник поновяє дане личинке
      Если запытаю одсланје личинке в изнаходь "/api/v1/thumbs/6b9e05cf-aabc-4dc3-97f7-4abd70d6f053.json" сꙛ даными:
         | uid             | 6b9e05cf-aabc-4dc3-97f7-4abd70d6f054 |
         | thumb_path      | features/fixtures/301x301-yellow.bmp |
         | thumbable_name  | Памѧтно#200202                       |
      То добѫдꙛ кодъ поврата "422"
      И добѫдꙛ вывод:
         """
         ---
         args:
           uid: 6b9e05cf-aabc-4dc3-97f7-4abd70d6f053
         error:
           uid:
           - has already been taken
           url:
           - has already been taken
         """

   @get @object
   Пример: Користник добыває дане личинке
      Если запытаю добыванје из изнахоѕи "/api/v1/thumbs/6b9e05cf-aabc-4dc3-97f7-4abd70d6f053.json"
      То добѫдꙛ вывод:
         """
         ---
         uid: 6b9e05cf-aabc-4dc3-97f7-4abd70d6f053
         url: "/thumbs/6b9e05cf-aabc-4dc3-97f7-4abd70d6f053.webp"
         thumbable_name: Памѧтно
         event_did:
         memory_short_name: Памѧтно
         """

   @delete @object
   Пример: Користник изтьрає иззначену личинку
      Если запытаю изтрѣнје изнахоѕи "/api/v1/thumbs/6b9e05cf-aabc-4dc3-97f7-4abd70d6f053.json"
      То добѫдꙛ кодъ поврата "200"
      И добѫдꙛ вывод:
         """
         ---
         uid: 6b9e05cf-aabc-4dc3-97f7-4abd70d6f053
         url: "/thumbs/6b9e05cf-aabc-4dc3-97f7-4abd70d6f053.webp"
         thumbable_name: Памѧтно
         event_did:
         memory_short_name: Памѧтно
         """
      И личинка "Личинка" не будє єствовати

   @get @collection @error
   Пример: Запрос к контроллеру личинок в АПИ при отсутствии личинок
      Пусть не єствує ни єдне личинке
      Если покушаю створити "GET" запытъ до адреса "/api/v1/thumbs.jsonp"
      То не добѫдꙛ кодъ поврата
