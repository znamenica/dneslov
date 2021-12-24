import { matchLanguages, matchAlphabeths, matchLetters, matchEmptyObject,
         matchCodes, matchEmptyCollection, matchValidJson } from 'matchers'
import { makeName, makeDescription } from 'makers'

export const subjectMeta = {
   default: "name",
   remoteName: 'subject',
   remoteNames: 'subjects',
   title: 'Предметы',
   new: 'Новый предмет',
   update: 'Обнови предмет',
   create: 'Создай предмет',
   close: 'Закрой',
   remove: {
      title: 'Точно ли удалить предмет %default?',
      yes: "Да"
   },
   row: {
      key: {
         title: 'Ключ',
      },
      kind_title: {
         title: 'Вид',
      },
      name: {
         title: 'Наименование',
         value: makeName,
         source: 'names',
      },
      description: {
         title: 'Описание',
         value: makeDescription,
         source: 'descriptions',
      },
   },
   form: {
      key: {
         kind: 'text',
         title: 'Написание имени',
         placeholder: 'Введи написание имени',
         display_scheme: '12-6-6-6',
         validations: {
            "Имя отсутствует": matchEmptyObject,
         }
      },
      kind_code: {
         kind: 'dynamic',
         display_scheme: '12-6-6-6',
         title: 'Вид',
         pathname: 'short_subjects',
         humanized_name: 'kind_title',
         placeholder: 'Начни ввод вида предмета...',
         context_value: { k: "SubjectKind" },
         key_name: 'value',
         value_name: 'key',
         validations: {
            'Вид из списка должен быть выбран': matchEmptyObject,
         }
      },
      meta: {
         kind: 'tale',
         title: 'Метаданные',
         placeholder: 'Введи метаданные',
         display_scheme: '12-12-12-12',
         validations: {
            'Текст имеет неверный формат JSON': matchValidJson,
         }
      },
      names: {
         kind: 'collection',
         title: 'Имена',
         action: 'Добавь имя',
         placeholder: 'Введи имя',
         filter: { type: "Appellation" },
         display_scheme: '12-12-12-12',
         meta: {
            id: {
               kind: 'hidden',
            },
            text: {
               kind: 'tale',
               title: 'Имя',
               placeholder: 'Введи имя',
               display_scheme: '12-12-12-12',
               validations: {
                  'Текст имени отсутствует': matchEmptyObject,
                  'Имя содержит знаки вне перечня избранной азбуки': matchLetters,
               }
            },
            language_code: {
               kind: 'dynamic',
               title: 'Язык',
               display_scheme: '12-12-6-6',
               pathname: 'short_subjects',
               humanized_name: 'language',
               context_value: { k: "Language" },
               key_name: 'value',
               value_name: 'key',
               placeholder: 'Начни ввод наименования языка...',
               validations: {
                  'Избранный язык не соотвествует избранной азбуке': matchCodes,
                  'Язык из списка должен быть выбран': matchEmptyObject,
               }
            },
            alphabeth_code: {
               kind: 'dynamic',
               title: 'Азбука',
               display_scheme: '12-12-6-6',
               pathname: 'short_subjects',
               humanized_name: 'alphabeth',
               context_value: { k: "Alphabeth" },
               key_name: 'value',
               value_name: 'key',
               placeholder: 'Начни ввод наименования азбуки...',
               validations: {
                  'Избранная азбука не соотвествует избранному языку': matchCodes,
                  'Азбука из списка должна быть выбрана': matchEmptyObject,
               }
            },
         }
      },
      descriptions: {
         kind: 'collection',
         title: 'Описания',
         action: 'Добавь описание',
         single: 'Описание',
         placeholder: 'Введи описание',
         filter: { type: "Description" },
         display_scheme: '12-12-12-12',
         meta: {
            id: {
               kind: 'hidden',
            },
            text: {
               kind: 'tale',
               title: 'Описание',
               placeholder: 'Введи описание',
               display_scheme: '12-12-12-12',
               validations: {
                  'Текст описания отсутствует': matchEmptyObject,
                  'Описание содержит знаки вне перечня избранной азбуки': matchLetters,
               }
            },
            language_code: {
               kind: 'dynamic',
               title: 'Язык',
               display_scheme: '12-12-6-6',
               pathname: 'short_subjects',
               humanized_name: 'language',
               context_value: { k: "Language" },
               key_name: 'value',
               value_name: 'key',
               placeholder: 'Начни ввод наименования языка...',
               validations: {
                  'Избранный язык не соотвествует избранной азбуке': matchCodes,
                  'Язык из списка должен быть выбран': matchEmptyObject,
               }
            },
            alphabeth_code: {
               kind: 'dynamic',
               title: 'Азбука',
               display_scheme: '12-12-6-6',
               pathname: 'short_subjects',
               humanized_name: 'alphabeth',
               context_value: { k: "Alphabeth" },
               key_name: 'value',
               value_name: 'key',
               placeholder: 'Начни ввод наименования азбуки...',
               validations: {
                  'Избранная азбука не соотвествует избранному языку': matchCodes,
                  'Азбука из списка должна быть выбрана': matchEmptyObject,
               }
            },
         }
      },
   }
}
