# language: ru
@model @memory_name
Функционал: Модель памятного имени
   Предыстория:
    * есть язык "ру"
    * есть алфавит "РУ"
    * есть событие "Canonization"
    * есть вид имени "наречёное"
    * есть вид связки имени "несвязаное"

#   Сценарий: Действительная запись
#      Допустим есть память "Василий Памятливый"
#      И есть русское личное имя Василий
#      И создадим новое памятное имя с полями:
#        | nomen>name       | ^Василий              |
#        | memory           | ^Василий Памятливый   |
#        | feasible         | 1                     |
#      То имя "Василий" будет существовать


   @memory @name
   Сценарий: Проверка полей модели имени
      Допустим есть память "Василий Памятливый"
      И есть русское личное имя Василий
      Допустим есть памятное имя Василий относящееся к памяти "Василий Памятливый"
      То свойства 'nomen, memory' памятного имени "Василий" являются отношением
      И свойства 'nomen, memory' памятного имени "Василий" не могут быть пустыми
      И свойство 'state' памятного имени "Василий" является отношением
      И свойство 'mode' памятного имени "Василий" является перечислителем
