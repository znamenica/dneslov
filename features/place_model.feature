# language: ru
@model @place
Функционал: Модель места
   Предыстория:
    * есть язык "ру"
    * есть алфавит "РУ"
    * есть событие "Canonization"

   @language
   Сценарий: Проверка полей модели места
      Допустим есть модель места

      И свойство "descriptions" модели не может быть пустым


   Сценарий: Проверка многосвязности полей модели места
      Если есть модель места
      То у модели суть действенными многоимущие свойства:
         | свойства        |
         | descriptions    |
         | events          |


   @language
   Сценарий: Недействительная запись места из-за отсутствия описания
      Если попробуем создать новое место без описаний
      То увидим сообщение места об ошибке:
         """
         Descriptions can't be blank
         """
      И места не будет


   @language
   Сценарий: Недействительная запись места из-за неверного описания
      Если попробуем создать новое место с неверным описанием
      То увидим сообщение места об ошибке:
         """
         Descriptions is invalid
         Descriptions text contains invalid char(s) "ὴⰅ" for the specified alphabeth "ВС"
         """
      И места не будет

