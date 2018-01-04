# language: ru
@auth @controller
Функционал: Контроллер сличения (auth controller)

   Сценарий: Проверка сличения пользователя на сервере
      Допустим есть пользователь с погонялом "user"
      И есть токен для пользователя "user"
      И есть имя описанное как:
         """
         ---
           :id: 1000
           :alphabeth_code: :ру
           :language_code: :ру
           :text: Валентин
         """
      Если запросим короткие имена
      То получим вывод:
         """
         ---
         list:
         - id: 1000
           name: Валентин
         total: 1
         """


   Сценарий: Ошибочный код сличения пользователя на сервере
      Допустим есть пользователь с погонялом "user1"
      И есть токен для пользователя "user1"
      Если сделаем "GET" запрос к адресу "/auth/github" с параметром "code=x"
      То заметим перенаправление на адрес "/admin" с ошибкою "FETCH_USER_INFO"