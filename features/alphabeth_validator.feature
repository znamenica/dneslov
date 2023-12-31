# language: ru
@validator @language
Функционал: Валидатор языка
   Предыстория:
    * есть язык "ру"
    * есть алфавит "РУ"
    * есть событие "Canonization"

   @description
   Сценарий: Проверка валидатора языка в описании
      И есть память "Василий Памятливый"
      Если создадим новое описание с полями:
        | alphabeth_code      | РУ                    |
        | language_code       | ру                    |
        | text                | Мурмур                |
        | describable:memory  | ^Василий Памятливый   |
      То русское описание "Мурмур" будет существовать


   @description
   Сценарий: Недействительное описание с текстом не соотвестствующим алфавиту
      Допустим есть память "Василий Памятливый"
      Если попробуем создать описание с полями:
        | alphabeth_code      | РУ                    |
        | language_code       | ру                    |
        | text                | Ἔὺὰ                   |
        | describable:memory  | ^Василий Памятливый   |
      То русского описания с текстом "Vasja" не будет
      И греческого описания не будет
      И увидим сообщение описания об ошибке:
         """
         Text contains invalid char(s) "Ἔὰὺ" for the specified alphabeth "РУ"
         """


   @description
   Сценарий: Недействительное описание с языком не соотвестствующим алфавиту
      Допустим есть память "Василий Памятливый"
      Если попробуем создать описание с полями:
        | alphabeth_code      | ГР                    |
        | language_code       | ру                    |
        | text                | Вася                  |
        | describable:memory  | ^Василий Памятливый   |
      То русского описания с текстом "Вася" не будет
      И греческого описания не будет
      И увидим сообщение описания об ошибке:
         """
         Alphabeth_code is not included in the list
         Text contains invalid char(s) "Вася" for the specified alphabeth "ГР"
         """


   @description
   Сценарий: Недействительное описание с языком не соотвестствующим алфавиту
      Допустим есть память "Василий Памятливый"
      Если попробуем создать описание с полями:
        | alphabeth_code      | РУ                    |
        | language_code       | гр                    |
        | text                | Вася                  |
        | describable:memory  | ^Василий Памятливый   |
      То русского описания с текстом "Вася" не будет
      И греческого описания не будет
      И увидим сообщение описания об ошибке:
         """
         Alphabeth_code is not included in the list
         """
