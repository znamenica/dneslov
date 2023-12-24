# language: ru
@api @thumb @controller @json
Свойство: Правач личинок
   Предыстория:
      * єствує памѧть "Памѧтно"
      * єствує личинка сѫ даными:
         | id              | 200001                               |
         | uid             | 6b9e05cf-aabc-4dc3-97f7-4abd70d6f053 |
         | thumbable_name  | Памѧтно                              |
         | thumb_path      | features/fixtures/canvas.jpg         |
      * єствує сꙛбытие "Сꙛбытие" сꙛ озом "200201" ѫ памѧти "Памѧтно"
      * єствує личинка сѫ даными:
         | id              | 200002                               |
         | uid             | 6b9e05cf-aabc-4dc3-97f7-4abd70d6f054 |
         | thumbable_name  | Памѧтно#Сꙛбытие                      |
         | thumb_path      | features/fixtures/canvas.jpg         |
      * єствує сꙛбытие "Сꙛбытко" сꙛ озом "200202" ѫ памѧти "Памѧтно"
      * єствує личинка сѫ даными:
         | id              | 200003                               |
         | uid             | 6b9e05cf-aabc-4dc3-97f7-4abd70d6f055 |
         | thumbable_name  | Памѧтно#200202                       |
         | thumb_path      | features/fixtures/canvas.jpg         |

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
         list:
         - uid: 6b9e05cf-aabc-4dc3-97f7-4abd70d6f053
           url: "/thumbs/6b9e05cf-aabc-4dc3-97f7-4abd70d6f053.webp"
           thumbable_name: Памѧтно
         - uid: 6b9e05cf-aabc-4dc3-97f7-4abd70d6f054
           url: "/thumbs/6b9e05cf-aabc-4dc3-97f7-4abd70d6f054.webp"
           thumbable_name: Памѧтно#200201
         - uid: 6b9e05cf-aabc-4dc3-97f7-4abd70d6f055
           url: "/thumbs/6b9e05cf-aabc-4dc3-97f7-4abd70d6f055.webp"
           thumbable_name: Памѧтно#200202
         page: 1
         per: 10
         total: 3
         """

   @get @collection
   Пример: Запрос постраничный к контроллеру личинок в АПИ
      Если сдѣлаю "GET" запытъ до адреса "/api/v1/thumbs.json" сꙛ доводом "per=2"
      То добѫдꙛ кодъ поврата "206"
      И добѫдꙛ приблизнъ извод:
         """
         ---
         list:
         - uid: 6b9e05cf-aabc-4dc3-97f7-4abd70d6f053
           url: "/thumbs/6b9e05cf-aabc-4dc3-97f7-4abd70d6f053.webp"
           thumbable_name: Памѧтно
         - uid: 6b9e05cf-aabc-4dc3-97f7-4abd70d6f054
           url: "/thumbs/6b9e05cf-aabc-4dc3-97f7-4abd70d6f054.webp"
           thumbable_name: Памѧтно#200201
         page: 1
         per: 2
         total: 3
         """
      Если сдѣлаю "GET" запытъ до адреса "/api/v1/thumbs.json" сꙛ доводом "per=2&page=2"
      То добѫдꙛ кодъ поврата "200"
      И добѫдꙛ приблизнъ извод:
         """
         ---
         list:
         - uid: 6b9e05cf-aabc-4dc3-97f7-4abd70d6f055
           url: "/thumbs/6b9e05cf-aabc-4dc3-97f7-4abd70d6f055.webp"
           thumbable_name: Памѧтно#200202
         page: 2
         per: 2
         total: 3
         """

   @create @object
   Пример: Користник створяє личинку
      Если запытаю створенје изнахоѕи личинци "/api/v1/thumbs/create.json" сꙛ даными:
         | uid             | 6b9e05cf-aabc-4dc3-97f7-4abd70d6f059 |
         | thumb_path      | features/fixtures/canvas.jpg         |
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
         thumb: "/public/thumbs/6b9e05cf-aabc-4dc3-97f7-4abd70d6f059.webp"
         thumbable_name: Памѧтно
         event_did:
         memory_short_name: Памѧтно
         """

   @updata @object @error @404
   Пример: Користник поновяє дане личинке
      Если запытаю одсланје личинке в изнаходь "/api/v1/thumbs/6b9e05cf-aabc-4dc3-97f7-4abd70d6f053.json" сꙛ даными:
         | uid             | 6b9e05cf-aabc-4dc3-97f7-4abd70d6f060 |
         | thumb_path      | features/fixtures/canvas.jpg         |
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

   @updata @object @error @422
   Пример: Користник поновяє дане личинке
      Если запытаю одсланје личинке в изнаходь "/api/v1/thumbs/6b9e05cf-aabc-4dc3-97f7-4abd70d6f053.json" сꙛ даными:
         | uid             | 6b9e05cf-aabc-4dc3-97f7-4abd70d6f054 |
         | thumb_path      | features/fixtures/canvas.jpg         |
         | thumbable_name  | Памѧтно#200202                       |
      То добѫдꙛ кодъ поврата "422"
      И добѫдꙛ вывод:
         """
         ---
         args:
           uid: 6b9e05cf-aabc-4dc3-97f7-4abd70d6f053
         error: |
           PG::UniqueViolation: ОШИБКА:  повторяющееся значение ключа нарушает ограничение уникальности "index_thumbs_on_uid"
           DETAIL:  Ключ "(uid)=(6b9e05cf-aabc-4dc3-97f7-4abd70d6f054)" уже существует.
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
