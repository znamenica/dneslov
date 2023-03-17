import { matchLanguages, matchAlphabeths, matchLetters, matchEmptyObject,
         matchCodes, matchEmptyCollection, matchValidJson } from 'matchers'
import { makeName, makeDescription } from 'makers'
import UrlRegexp from 'UrlRegexp'

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
         kind: 'json',
         title: 'Метаданные',
         placeholder: 'Введи метаданные',
         display_scheme: '12-12-12-12',
         validations: {
            'Поле не может быть пустым': matchEmptyObject,
            'Текст имеет неверный формат JSON': matchValidJson
         },
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
               subscribeTo: '@alphabeth_code',
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
               subscribeTo: '@alphabeth_code',
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
               subscribeTo: '@language_code',
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
               subscribeTo: '@alphabeth_code',
               validations: {
                  'Текст описания отсутствует': matchEmptyObject,
                  'Описание содержит знаки вне перечня избранной азбуки': matchLetters,
               }
            },
            language_code: {
               kind: 'dynamic',
               title: 'Язык',
               display_scheme: '12-6-6-6',
               pathname: 'short_subjects',
               humanized_name: 'language',
               context_value: { k: "Language" },
               key_name: 'value',
               value_name: 'key',
               placeholder: 'Начни ввод наименования языка...',
               subscribeTo: '@alphabeth_code',
               validations: {
                  'Избранный язык не соотвествует избранной азбуке': matchCodes,
                  'Язык из списка должен быть выбран': matchEmptyObject,
               }
            },
            alphabeth_code: {
               kind: 'dynamic',
               title: 'Азбука',
               display_scheme: '12-6-6-6',
               pathname: 'short_subjects',
               humanized_name: 'alphabeth',
               context_value: { k: "Alphabeth" },
               key_name: 'value',
               value_name: 'key',
               placeholder: 'Начни ввод наименования азбуки...',
               subscribeTo: '@language_code',
               validations: {
                  'Избранная азбука не соотвествует избранному языку': matchCodes,
                  'Азбука из списка должна быть выбрана': matchEmptyObject,
               }
            },
         }
      },
      links: {
         kind: 'collection',
         display_scheme: '12-12-12-12',
         title: 'Ссылки',
         action: 'Добавь ссылку',
         placeholder: 'Введи ссылку',
         source: "links",
         meta: {
            id: {
               kind: 'hidden',
            },
            url: {
               kind: 'text',
               title: 'Ссылка',
               placeholder: 'Введи ссылку',
               display_scheme: '12-12-6-6',
               validations: {
                  "Ссылка отсутствует": matchEmptyObject,
                  "Неверный формат ссылки на бытие": [ "!", UrlRegexp ],
               }
            },
            language_code: {
               kind: 'dynamic',
               title: 'Язык',
               display_scheme: '12-4-2-2',
               pathname: 'short_subjects',
               humanized_name: 'language',
               context_value: { k: "Language" },
               key_name: 'value',
               value_name: 'key',
               visible_if: { type: ["WikiLink", "DescriptiveLink"] },
               placeholder: 'Начни ввод наименования языка...',
               subscribeTo: '@alphabeth_code',
               validations: {
                  'Избранный язык не соотвествует избранной азбуке': matchCodes,
                  'Язык из списка должен быть выбран': matchEmptyObject,
               }
            },
            alphabeth_code: {
               kind: 'dynamic',
               title: 'Азбука',
               display_scheme: '12-4-2-2',
               pathname: 'short_subjects',
               humanized_name: 'alphabeth',
               context_value: { k: "Alphabeth" },
               key_name: 'value',
               value_name: 'key',
               visible_if: { type: ["WikiLink", "DescriptiveLink"] },
               placeholder: 'Начни ввод наименования азбуки...',
               subscribeTo: '@language_code',
               validations: {
                  'Избранная азбука не соотвествует избранному языку': matchCodes,
                  'Азбука из списка должна быть выбрана': matchEmptyObject,
               }
            },
            type: {
               kind: 'select',
               title: 'Вид ссылки',
               codeNames: {
                  '': 'Избери вид текста...',
                  'WikiLink': 'Вики-ссылка',
                  'DescriptiveLink': 'Описательная ссылка',
                  'PhotoLink': 'Фото-ссылка',
               },
               display_scheme: '12-4-2-2',
               validations: {
                  'Пункт из списка должен быть выбран': matchEmptyObject,
               },
            },
         }
      },
   }
}
