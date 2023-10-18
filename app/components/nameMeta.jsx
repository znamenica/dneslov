import { matchLanguages, matchAlphabeths, matchLetters, matchEmptyObject, matchCodes, matchEmptyCollection } from 'matchers'
import UrlRegexp from 'UrlRegexp'

export const nameMeta = {
   default: "text",
   remoteName: 'name',
   remoteNames: 'names',
   title: 'Имена',
   new: 'Новое имя',
   update: 'Обнови имя',
   create: 'Создай имя',
   close: 'Закрой',
   remove: {
      title: 'Точно ли удалить имя %default?',
      yes: "Да"
   },
   row: {
      text: {
         title: 'Написание',
      },
      language_code: {
         title: 'Язык',
      },
      alphabeth_code: {
         title: 'Азбука',
      },
      bind_kind_name: {
         title: 'Связка',
         value: (value) => {
            return value.nomina && value.nomina[0]?.bind_kind_name
         },
      },
      bond_to_name: {
         title: 'Связано с...',
         value: (value) => {
            return value.nomina && value.nomina[0]?.bond_to_name
         },
      },
      root_name: {
         title: 'Корневое имя',
         value: (value) => {
            return value.nomina && value.nomina[0]?.root_name
         },
      },
   },
   form: {
      text: {
         kind: 'text',
         name: 'text',
         title: 'Написание имени',
         placeholder: 'Введи написание имени',
         display_scheme: '12-4-6-8',
         subscribeTo: '@alphabeth_code',
         validations: {
            "Имя отсутствует": matchEmptyObject,
            'Описание содержит знаки вне перечня избранной азбуки': matchLetters,
         },
      },
      language_code: {
         kind: 'dynamic',
         title: 'Язык',
         display_scheme: '12-4-3-2',
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
         display_scheme: '12-4-3-2',
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
      nomina: {
         kind: 'collection',
         title: 'Связи',
         action: 'Добавь связь',
         single: 'Связь',
         placeholder: 'Введи связь',
         display_scheme: '12-12-12-12',
         validations: {
            'Минимум одна связь должна быть задана':  matchEmptyCollection
         },
         meta: {
            id: {
               kind: 'hidden',
            },
            root_id: {
               kind: 'dynamic',
               humanized_name: 'root_name',
               title: 'Корневое имя',
               display_scheme: '12-3-3-4',
               placeholder: 'Начни ввод имени...',
               pathname: 'short_names',
               key_name: 'value',
               value_name: 'key',
            },
            bind_kind_name: {
               humanized_name: 'bind_kind_humanized',
               kind: 'dynamic',
               display_scheme: '12-3-3-2',
               title: 'Вид связки',
               placeholder: 'Начни ввод связки...',
               pathname: 'short_subjects',
               context_value: { k: "NameBind" },
               key_name: 'value',
               value_name: 'key',
               subscribeTo: '@bond_to_id',
               default: "несвязаное", // default value
               humanized_default: "Не связанное", // default value name
               validations: {
                  'Вид связки из списка должен быть выбран': matchEmptyObject,
                  'Вид связки не должен иметь значение "Не связанное" в случае, если связаное имя задано': (value, context) => {
                     return context.bond_to_id && value == "несвязаное"
                  },
                  'Вид связки должен иметь значение "Не связанное" в случае, если связаное имя отсутствует': (value, context) => {
                     return !context.bond_to_id && value != "несвязаное"
                  },
               }
            },
            bond_to_id: {
               kind: 'dynamic',
               title: 'Связаное имя',
               humanized_name: 'bond_to_name',
               display_scheme: '12-3-3-4',
               placeholder: 'Начни ввод имени...',
               pathname: 'short_names',
               key_name: 'value',
               value_name: 'key',
               subscribeTo: ['@bind_kind_name', '@text'],
               validations: {
                  'Связаное имя не должно соответствовать названию текущего имени': (value, context) => {
                     return value && value == context.id
                  },
               }
            },
            modifier: {
               kind: 'text',
               name: 'modifier',
               title: 'Прилаживатель (модификатор)',
               placeholder: 'Введи прилаживатель (модификатор)',
               display_scheme: '12-3-3-2',
               visible_if: { bind_kind_name: ["прилаженое"] },
               subscribeTo: '@bind_kind_name',
            },
         },
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
                  "Неверный формат ссылки": [ "!", UrlRegexp ],
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
