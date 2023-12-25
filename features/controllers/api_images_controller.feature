# language: ru
@api @image @controller @json
Свойство: Правач картинок
   Предыстория:
      * є картинка сѫ даными:
         | id           | 200001                               |
         | uid          | 6b9e05cf-aabc-4dc3-97f7-4abd70d6f053 |
         | type         | Picture                              |
         | meta         | {}                                   |
         | image_path   | features/fixtures/canvas.jpg         |
         | title        | Картинка                             |
      * єствує памѧть "Памѧтно"
      * є картинка сѫ даными:
         | id           | 200012                               |
         | uid          | 6b9e05cf-aabc-4dc3-97f7-4abd70d6f063 |
         | type         | Photo                                |
         | meta         | {}                                   |
         | image_path   | features/fixtures/canvas.jpg         |
         | title        | Фотка                                |
         | attitude_to  | Памѧтно(10,100)                      |

   @get @collection
   Пример: Запрос к контроллеру картинок в АПИ при отсутствии картинок
      Пусть не єствує ни єдне картинке
      Если сдѣлаю "GET" запытъ до адреса "/api/v1/images.json"
      То добѫдꙛ кодъ поврата "204"


   @get @collection
   Пример: Запрос к контроллеру картинок в АПИ
      Пусть сѫ "1" слика
      Если сдѣлаю "GET" запытъ до адреса "/api/v1/images.json"
      То добѫдꙛ кодъ поврата "200"

   @get @collection
   Пример: Користник добыває списъ картинок
      Если запытаю добыванје из изнахоѕи "/api/v1/images.json"
      То добѫдꙛ кодъ поврата "200"
      И добѫдꙛ вывод:
         """
         ---
         - uid: 6b9e05cf-aabc-4dc3-97f7-4abd70d6f053
           type: Picture
           language: ру
           alphabeth: РУ
           title: Картинка
           description:
           url: "/images/6b9e05cf-aabc-4dc3-97f7-4abd70d6f053.webp"
         - uid: 6b9e05cf-aabc-4dc3-97f7-4abd70d6f063
           type: Photo
           language: ру
           alphabeth: РУ
           title: Фотка
           description:
           url: "/images/6b9e05cf-aabc-4dc3-97f7-4abd70d6f063.webp"
         """
      А добѫдꙛ охватъ "0-9/2"
      И добѫдꙛ длину охвата "2"

   @get @collection
   Пример: Запрос постраничный к контроллеру картинок в АПИ
      Пусть сѫ слике:
         """
         ---
         - id: 200002
           uid: 6b9e05cf-aabc-4dc3-97f7-4abd70d6f054
           type: Icon
           image_path: features/fixtures/canvas.jpg
           meta: {}
           title: Картинка 2
         - id: 200003
           uid: 6b9e05cf-aabc-4dc3-97f7-4abd70d6f055
           type: Painting
           image_path: features/fixtures/canvas.jpg
           meta: {}
           title: Picture 3
         - id: 200004
           uid: 6b9e05cf-aabc-4dc3-97f7-4abd70d6f056
           type: Photo
           image_path: features/fixtures/canvas.jpg
           meta: {}
           title: Aperçu 4
         """
      Если сдѣлаю "GET" запытъ до адреса "/api/v1/images.json" сꙛ доводом "per=3"
      То добѫдꙛ кодъ поврата "206"
      И добѫдꙛ приблизнъ извод:
         """
         ---
         - uid: 6b9e05cf-aabc-4dc3-97f7-4abd70d6f053
           type: Picture
           language: ру
           alphabeth: РУ
           title: Картинка
           description:
           url: "/images/6b9e05cf-aabc-4dc3-97f7-4abd70d6f053.webp"
         - uid: 6b9e05cf-aabc-4dc3-97f7-4abd70d6f063
           type: Photo
           language: ру
           alphabeth: РУ
           title: Фотка
           description:
           url: "/images/6b9e05cf-aabc-4dc3-97f7-4abd70d6f063.webp"
         - uid: 6b9e05cf-aabc-4dc3-97f7-4abd70d6f054
           type: Icon
           language: ру
           alphabeth: РУ
           title: Картинка 2
           description:
           url: "/images/6b9e05cf-aabc-4dc3-97f7-4abd70d6f054.webp"
         """
      А добѫдꙛ охватъ "0-2/5"
      И добѫдꙛ длину охвата "3"
      Если сдѣлаю "GET" запытъ до адреса "/api/v1/images.json" сꙛ доводом "per=3&page=2"
      То добѫдꙛ кодъ поврата "200"
      И добѫдꙛ приблизнъ извод:
         """
         ---
         - uid: 6b9e05cf-aabc-4dc3-97f7-4abd70d6f055
           type: Painting
           language: ан
           alphabeth: АН
           title: Picture 3
           description:
           url: "/images/6b9e05cf-aabc-4dc3-97f7-4abd70d6f055.webp"
         - uid: 6b9e05cf-aabc-4dc3-97f7-4abd70d6f056
           type: Photo
           language: фр
           alphabeth: ФР
           title: Aperçu 4
           description:
           url: "/images/6b9e05cf-aabc-4dc3-97f7-4abd70d6f056.webp"
         """
      А добѫдꙛ охватъ "3-5/5"
      И добѫдꙛ длину охвата "2"

   @get @collection @error @416
   Пример: Запрос к контроллеру картинок в АПИ
      Если сдѣлаю "GET" запытъ до адреса "/api/v1/images.json" сꙛ доводом "page=111111"
      То добѫдꙛ кодъ поврата "416"
      И добѫдꙛ приблизнъ извод:
         """
         ---
         args:
           page: '111111'
         """

   @get @collection @error @416
   Пример: Запрос к контроллеру картинок в АПИ
      Если сдѣлаю "GET" запытъ до адреса "/api/v1/images.json" сꙛ заглавјем:
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
   Пример: Користник створяє картинку
      Если запытаю створенје изнахоѕи картинци "/api/v1/images/create.json" сꙛ даными:
         | uid          | 6b9e05cf-aabc-4dc3-97f7-4abd70d6f054 |
         | type         | Picture                              |
         | meta         | {}                                   |
         | image_path   | features/fixtures/canvas.jpg         |
         | title        | Картинка                             |
         | description  | Описание                             |
         | language     | ру                                   |
         | alphabeth    | РУ                                   |
      То добѫдꙛ кодъ поврата "200"
      И добѫдꙛ вывод:
         """
         ---
         uid: 6b9e05cf-aabc-4dc3-97f7-4abd70d6f054
         type: Picture
         meta: {}
         language: ру
         alphabeth: РУ
         title: Картинка
         description: Описание
         url: "/images/6b9e05cf-aabc-4dc3-97f7-4abd70d6f054.webp"
         attitudes: []
         """
      И изнахоѕь картинци "Картинка" бѫдє яко:
         """
         ---
         uid: 6b9e05cf-aabc-4dc3-97f7-4abd70d6f054
         type: Picture
         meta: {}
         language: ру
         alphabeth: РУ
         title: Картинка
         description: Описание
         url: "/images/6b9e05cf-aabc-4dc3-97f7-4abd70d6f054.webp"
         image: "/public/images/6b9e05cf-aabc-4dc3-97f7-4abd70d6f054.webp"
         attitudes: []
         """

   @updata @object @error @404
   Пример: Користник поновяє дане картинке
      Если запытаю одсланје картинке в изнаходь "/api/v1/images/6b9e05cf-aabc-4dc3-97f7-4abd70d6f053.json" сꙛ даными:
         | uid          | 6b9e05cf-aabc-4dc3-97f7-4abd70d6f054 |
         | type         | Picture                              |
         | meta         | {}                                   |
         | image_path   | features/fixtures/canvas.jpg         |
         | title        | Картинка 1                           |
         | description  | Описание 1                           |
         | language     | ру                                   |
         | alphabeth    | РУ                                   |
      То добѫдꙛ кодъ поврата "200"
      И добѫдꙛ вывод:
         """
         ---
         uid: 6b9e05cf-aabc-4dc3-97f7-4abd70d6f054
         type: Picture
         meta: {}
         language: ру
         alphabeth: РУ
         title: Картинка 1
         description: Описание 1
         url: "/images/6b9e05cf-aabc-4dc3-97f7-4abd70d6f054.webp"
         attitudes: []
         """
      Если запытаю добыванје из изнахоѕи "/api/v1/images/6b9e05cf-aabc-4dc3-97f7-4abd70d6f054.json"
      То добѫдꙛ кодъ поврата "200"
      И добѫдꙛ вывод:
         """
         ---
         uid: 6b9e05cf-aabc-4dc3-97f7-4abd70d6f054
         type: Picture
         meta: {}
         language: ру
         alphabeth: РУ
         title: Картинка 1
         description: Описание 1
         url: "/images/6b9e05cf-aabc-4dc3-97f7-4abd70d6f054.webp"
         attitudes: []
         """
      Если запытаю добыванје из изнахоѕи "/api/v1/images/6b9e05cf-aabc-4dc3-97f7-4abd70d6f053.json"
      То добѫдꙛ кодъ поврата "404"

   @get @object
   Пример: Користник добыває дане картинке
      Если запытаю добыванје из изнахоѕи "/api/v1/images/6b9e05cf-aabc-4dc3-97f7-4abd70d6f053.json"
      То добѫдꙛ вывод:
         """
         ---
         uid: 6b9e05cf-aabc-4dc3-97f7-4abd70d6f053
         type: Picture
         meta: {}
         language: ру
         alphabeth: РУ
         title: Картинка
         description:
         url: "/images/6b9e05cf-aabc-4dc3-97f7-4abd70d6f053.webp"
         attitudes: []
         """

   @delete @object
   Пример: Користник изтьрає иззначену картинку
      Если запытаю изтрѣнје изнахоѕи "/api/v1/images/6b9e05cf-aabc-4dc3-97f7-4abd70d6f053.json"
      То добѫдꙛ кодъ поврата "200"
      И добѫдꙛ вывод:
         """
         ---
         uid: 6b9e05cf-aabc-4dc3-97f7-4abd70d6f053
         type: Picture
         meta: {}
         language: ру
         alphabeth: РУ
         title: Картинка
         description:
         url: "/images/6b9e05cf-aabc-4dc3-97f7-4abd70d6f053.webp"
         attitudes: []
         """
      И картинка "Картинка" не будє єствовати

   @get @collection @error
   Пример: Запрос к контроллеру картинок в АПИ при отсутствии картинок
      Пусть не єствує ни єдне картинке
      Если покушаю створити "GET" запытъ до адреса "/api/v1/images.jsonp"
      То не добѫдꙛ кодъ поврата
      А вывода не бѫдє
