import { matchLanguages, matchAlphabeths, matchLetters, matchEmptyObject,
         matchCodes, matchEmptyCollection } from 'matchers'
import { makeTweet, makeNote, makeDescription } from 'makers'
import UrlRegexp from 'UrlRegexp'

export const orderMeta = {
   default: 'note',
   remoteName: 'order',
   remoteNames: 'orders',
   title: 'Чины',
   new: 'Новый чин',
   update: 'Обнови чин',
   create: 'Создай чин',
   close: 'Закрой',
   remove: {
      title: 'Точно ли удалить чин %default?',
      yes: "Да"
   },
   row: {
      slug: {
         title: 'Плашка',
         value: (value) => { return value.slug.text }
      },
      tweet: {
         title: 'Сокращение',
         value: makeTweet,
         source: 'descriptions',
         filter: { type: "Tweet" },
      },
      note: {
         title: 'Наименование',
         value: makeNote,
         source: 'descriptions',
         filter: { type: "Note" },
      },
      description: {
         title: 'Описание',
         value: makeDescription,
         source: 'descriptions',
         filter: { type: "Description" },
      },
   },
   form: {
      slug: {
         kind: 'block',
         meta: {
            id: {
               kind: 'hidden',
            },
            text: {
               kind: 'text',
               name: 'text',
               title: 'Жетон',
               placeholder: 'Введи имя жетона',
               data: {length: '6'},
               display_scheme: '12-6-2-2',
               validations: {
                  "Слишком большое имя жетона": /^.{7,}$/,
                  "Жетон отсутствует": matchEmptyObject,
                  "В имени жетона допустимы только русская кириллица и цифры": /[^ёа-я0-9]/
               }
            }
         }
      },
      tweets: {
         kind: 'collection',
         title: "Сокращения",
         action: "Добавь сокращение",
         filter: { type: "Tweet" },
         source: "descriptions",
         display_scheme: '12-12-12-12',
         validations: {
            "Должно быть задано как минимум одно сокращение": matchEmptyObject,
            "Языки в сокращеньях не могут совпадать": matchLanguages,
            "Азбуки в сокращеньях не могут совпадать": matchAlphabeths,
         },
         meta: {
            id: {
               kind: 'hidden',
            },
            text: {
               kind: 'text',
               title: 'Краткое имя',
               placeholder: 'Введи краткое имя',
               display_scheme: '12-12-6-6',
               validations: {
                  "Краткое имя отсутствует": matchEmptyObject,
                  'Краткое имя содержит знаки вне перечня избранной азбуки': matchLetters,
               }
            },
            language_code: {
               kind: 'dynamic',
               title: 'Язык',
               display_scheme: '12-6-3-3',
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
               display_scheme: '12-6-3-3',
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
      notes: {
         kind: 'collection',
         title: "Заглавки",
         action: "Добавь заглавок",
         name: 'notes',
         source: "descriptions",
         filter: { type: "Note" },
         display_scheme: '12-12-12-12',
         validations: {
            'Минимум один заглавок должно быть задано':  matchEmptyCollection,
            'Языки в заглавках не могут совпадать': matchLanguages,
            'Азбуки в заглавках не могут совпадать': matchAlphabeths,

         },
         meta: {
            id: {
               kind: 'hidden',
            },
            text: {
               kind: 'text',
               title: 'Имя',
               placeholder: 'Введи имя',
               name: 'text',
               display_scheme: '12-12-6-6',
               validations: {
                  "Имя отсутствует": matchEmptyObject,
                  'Имя содержит знаки вне перечня избранной азбуки': matchLetters,
               }
            },
            language_code: {
               kind: 'dynamic',
               title: 'Язык',
               display_scheme: '12-6-3-3',
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
               display_scheme: '12-6-3-3',
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
               display_scheme: '12-6-6-6',
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
               display_scheme: '12-6-6-6',
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
