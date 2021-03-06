# language: ru
@model @event
Функционал: Модель события
   Предыстория:
    * есть язык "ру"
    * есть алфавит "РУ"
    * есть события "Canonization, Benediction"

   @language
   Сценарий: Проверка полей модели события
      Допустим есть модель события

      И свойства "kind, kind_code" модели не могут быть пустыми
      И таблица модели имеет столбцы "memory_id, place_id" рода "целый"
      И событие имеет рода "строка" следущие столбцы:
         | столбец            |
         | kind_code          |
         | happened_at        |


   Сценарий: Проверка многосвязности полей модели события
      Если есть модель события
      То свойство "memory" модели есть отношение к памяти
      И свойство "place" модели есть отношение к описываемому


   @language
   Сценарий: Действительная запись события
      Допустим есть память "Василий Памятливый"
      И есть русское место "Красная площадь"

      Если создадим новое событие с полями:
        | happened_at         | 10.10.1010            |
        | kind_code           | Benediction           |
        | memory              | ^Василий Памятливый   |
        | place.descriptions  | ^Красная площадь      |
      То событие "10.10.1010" будет существовать
