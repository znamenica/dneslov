# language: ru
@model @service
Функционал: Модель службы
   Предыстория:
    * есть язык "ру"
    * есть алфавит "РУ"
    * есть событие "Canonization"

   @language
   Сценарий: Проверка полей модели службы
      Допустим есть модель службы

      То свойства "name, info" службы не могут быть пустыми
      И служба имеет столбец "text" рода "текст"
      И служба имеет рода "строка" следущие столбцы:
         | столбец            |
         | description        |
         | text_format        |
         | name               |
         | info_type          |
         | language_code      |
         | alphabeth_code     |


   @chant
   Сценарий: Проверка многосвязности поля памятей
      Допустим есть модель службы

      То служба имеет много служебных песм
      И служба имеет много песм через служебные песмена
      И служба относится к информируемому


   Сценарий: Недействительная запись службы при отсутствии памяти
      Допустим попробуем создать службу с полями:
        | alphabeth_code   | РУ              |
        | language_code    | ру              |
        | name             | Василию служба  |
        | info             | ---\n...        |
      То русских служб не будет
      И увидим сообщение службы об ошибке:
         """
         Info can't be blank
         """


   @language
   Сценарий: Действительная запись службы
      Допустим есть память "Василий Памятливый"
      И создадим новую службу с полями:
        | alphabeth_code   | РУ                    |
        | language_code    | ру                    |
        | name             | Василию служба        |
        | info:memory      | ^Василий Памятливый   |
      То русская служба "Василию служба" будет существовать


      # TODO
#   @language
#   Сценарий: Недействительная запись службы при несоотвествии языка её имени
#      Допустим есть память "Василий Памятливый"
#      И попробуем создать службу с полями:
#        | alphabeth_code   | ГР                    |
#        | language_code    | гр                    |
#        | name             | Василию служба        |
#        | info:memory      | *Василий Памятливый   |
#      То греческой службы "Василию служба" не будет
#      И увидим сообщение службы об ошибке:
#         """
#         Name contains invalid char(s) "Вабжилсую" for the specified alphabeth "ГР"
#         """
