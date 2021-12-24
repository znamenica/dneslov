# language: ru
@model @calendary
Функционал: Модель календаря
   Предыстория:
    * есть язык "ру"
    * есть алфавит "РУ"

   @language
   Сценарий: Проверка полей модели календаря
      Допустим есть модель календаря

      То свойства "slug, titles, date" модели не могут быть пустыми
      И календарь имеет рода "строка" следущие столбцы:
         | столбец            |
         | author_name        |
         | date               |
         | language_code      |
         | alphabeth_code     |


   Сценарий: Проверка многосвязности полей модели календаря
      Если есть модель календаря
      То у модели суть действенными многоимущие свойства:
         | свойства        | как          | зависимость  | имя рода     |
         | descriptions    | describable  | delete_all   | описание     |
         | links           | describable  | delete_all   | найменование |
         | titles          | describable  | delete_all   | найменование |
         | wikies          | describable  | delete_all   | найменование |
         | beings          | describable  | delete_all   | найменование |
         | memos           | describable  | delete_all   | найменование |
      И модель принимает вложенные настройки для свойства "descriptions"
      И модель принимает вложенные настройки для свойства "slug"
      И модель принимает вложенные настройки для свойства "place"
      И модель принимает вложенные настройки для свойства "titles"
      И модель принимает вложенные настройки для свойства "wikies"
      И модель принимает вложенные настройки для свойства "beings"


   @language
   Сценарий: Недействительная связь календаря и его описания
      Допустим попробуем создать календарь "клнд" без описания

      То увидим сообщение календаря об ошибке:
         """
         Titles can't be blank
         """
      И календаря "клнд" не будет


   @description
   Сценарий: Действительная связь календаря и его описания
      Если создадим календарь "клнд"
      То календарь "клнд" будет существовать
      И календарь "клнд" будет иметь "1" описание
      И календарь "клнд" будет иметь "1" титул


   @language
   Сценарий: Неверный язык календаря
      Если попробуем создать новый календарь с полями:
        | alphabeth_code   | РР        |
        | language_code    | уу        |
        | author_name      | Василий   |
        | slug             | клнд      |
        | date             | Година    |
        | descriptions     | ---\n...  |
        | titles           | ---\n...  |
      То увидим сообщение календаря об ошибке:
         """
         Language_code is not included in the list
         Alphabeth_code is not included in the list
         Titles can't be blank
         """
      И календаря "клнд" не будет


   @language
   Сценарий: Неверный алфавит календаря
      Если попробуем создать новый календарь с полями:
        | alphabeth_code   | УУ        |
        | language_code    | ру        |
        | author_name      | Василий   |
        | slug             | клнд      |
        | date             | Година    |
        | descriptions     | ---\n...  |
        | titles           | ---\n...  |
      То увидим сообщение календаря об ошибке:
         """
         Alphabeth_code is not included in the list
         Titles can't be blank
         """
      И календаря "клнд" не будет


   @language
   Сценарий: Недействительное описание календаря
      Если попробуем создать новый календарь "клнд" с неверным описанием
      То увидим сообщение календаря об ошибке:
         """
         Descriptions is invalid
         Descriptions text contains invalid char(s) "adilnv" for the specified alphabeth "РУ"
         """
      И календаря "клнд" не будет
