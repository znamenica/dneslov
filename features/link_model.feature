# language: ru
@model @link
Функционал: Модель ссылки
   Предыстория:
    * есть язык "ру"
    * есть алфавит "РУ"
    * есть событие "Canonization"

   @language
   Сценарий: Проверка полей модели ссылки
      Допустим есть модель ссылки

      И свойства "type" модели не могут быть пустыми
      И таблица модели имеет столбцы "info_id" рода "целый"
      И ссылка имеет рода "строка" следущие столбцы:
         | столбец            |
         | url                |
         | type               |
         | info_type          |
         | language_code      |
         | alphabeth_code     |


   Сценарий: Проверка многосвязности полей модели ссылки
      Если есть модель отечниковой ссылки
      То свойство "info" модели есть отношение
      Если есть модель вики ссылки
      То свойство "info" модели есть отношение
      Если есть модель бытийной ссылки
      То свойство "info" модели есть отношение
      Если есть модель служебной ссылки
      То свойство "info" модели есть отношение
      Если есть модель иконной ссылки
      То свойство "info" модели есть отношение


   @language
   Сценарий: Действительная запись вики ссылки
      Допустим есть память "Василий Памятливый"

      Если создадим новую вики ссылку с полями:
        | alphabeth_code   | РУ                    |
        | language_code    | ру                    |
        | url              | http://example.com/   |
        | info:memory      | ^Василий Памятливый   |
      То русская вики ссылка "http://example.com/" будет существовать


   Сценарий: Неверный url вики ссылки
      Допустим есть память "Василий Памятливый"

      Если попробуем создать новую вики ссылку с полями:
        | alphabeth_code   | РУ                    |
        | language_code    | ру                    |
        | url              | :@://recource@ru      |
        | info:memory      | ^Василий Памятливый   |
      То увидим сообщение ссылки об ошибке:
         """
         Url @://recource@ru is invalid
         """
      И ссылки "httr://recource.ru" не будет


   Сценарий: Недоступный url вики ссылки
      Допустим есть память "Василий Памятливый"

      Если попробуем создать новую вики ссылку с полями:
        | alphabeth_code   | РУ                                            |
        | language_code    | ру                                            |
        | url              | https://kuz1.pstbi.ccas.ru/foto_1/ob4-01f.jpg |
        | info:memory      | ^Василий Памятливый                           |
      То увидим сообщение ссылки об ошибке:
         """
         Url is inaccessible at https://kuz1.pstbi.ccas.ru/foto_1/ob4-01f.jpg
         """
      И ссылки "http://recource.ru" не будет


   @language
   Сценарий: Действительная связь вики ссылки и её описания
      Допустим есть иконная ссылка "http://www.wiki.ru" без описания

      Если создадим новое описание с полями:
        | language_code    | ру                    |
        | alphabeth_code   | РУ                    |
        | text             | Мурмур                |
        | describable:link | ^http://www.wiki.ru   |
      То русская иконная ссылка "http://www.wiki.ru" будет действительной


   @language
   Сценарий: Недействительное описание иконной ссылки
      Допустим есть память "Василий Памятливый"

      Если попробуем создать новую иконную ссылку "http://www.wiki.su" с неверным описанием
      То увидим сообщение ссылки об ошибке:
         """
         Descriptions text contains invalid char(s) "ὴⰅ" for the specified alphabeth "ВС"
         Descriptions is invalid
         """
      И ссылки "http://www.wiki.ru" не будет
