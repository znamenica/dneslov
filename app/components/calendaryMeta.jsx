import { matchLanguages, matchAlphabeths, matchLetters, matchEmptyObject, matchCodes, matchEmptyCollection, matchValidJson, matchValidUrl } from 'matchers'
import { makeTitle } from 'makers'
import UrlRegexp from 'UrlRegexp'

export const calendaryMeta = {
   default: 'title',
   remoteName: 'calendary',
   remoteNames: 'calendaries',
   title: 'Календари',
   new: 'Новый календарь',
   update: 'Обнови календарь',
   create: 'Создай календарь',
   close: 'Закрой',
   remove: {
      title: 'Точно ли удалить календарь %default?',
      yes: "Да"
   },
   row: {
      title: {
         title: 'Имя',
         value: makeTitle,
         source: 'descriptions',
         filter: { type: "Appellation" },
      },
      licit: {
         title: 'thumb_up',
      },
      language_code: {
         title: 'Язык',
      },
      alphabeth_code: {
         title: 'Азбука',
      },
      author_name: {
         title: 'Автор',
      },
      date: {
         title: 'Дата',
      }, 
      council: {
         title: 'Собор'
      }
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
               display_scheme: '12-4-2-2',
               validations: {
                  "Слишком большое имя жетона": /^.{7,}$/,
                  "Жетон отсутствует": matchEmptyObject,
                  "В имени жетона допустимы только русская кириллица и цифры": /[^ёа-я0-9]/
               }
            }
         }
      },
      language_code: {
         kind: 'dynamic',
         title: 'Язык',
         display_scheme: '12-8-4-4',
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
         display_scheme: '12-8-4-4',
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
      licit: {
         kind: 'boolean',
         name: 'licit',
         title: 'Опубликовать',
         display_scheme: '12-4-2-2',
      },
      titles: {
         kind: 'collection',
         title: "Имена",
         action: "Добавь имя",
         display_scheme: '12-12-12-12',
         source: "descriptions",
         filter: { type: "Appellation" },
         validations: {
            'Минимум одно имя должно быть задано':  matchEmptyCollection,
            'Языки в именах не могут совпадать': matchLanguages,
            'Азбуки в именах не могут совпадать': matchAlphabeths,

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
               subscribeTo: '@alphabeth_code',
               validations: {
                  'Текст имени отсутствует': matchEmptyObject,
                  'Набранный текст содержит знаки вне перечня избранной азбуки': matchLetters,
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
               subscribeTo: '@alphabeth_code',
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
         title: "Описания",
         action: "Добавь описание",
         display_scheme: '12-12-12-12',
         filter: { type: "Description" },
         validations: {
            'Языки в описаниях не могут совпадать': matchLanguages,
            'Азбуки в описаниях не могут совпадать': matchAlphabeths,

         },
         meta: {
            id: {
               kind: 'hidden',
            },
            text: {
               kind: 'tale',
               title: 'Имя',
               name: 'text',
               placeholder: 'Введи имя',
               display_scheme: '12-12-12-12',
               subscribeTo: '@alphabeth_code',
               validations: {
                  'Текст имени отсутствует': matchEmptyObject,
                  'Набранный текст содержит знаки вне перечня избранной азбуки': matchLetters,
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
                  "Неверный формат ссылки": matchValidUrl,
               }
            },
            type: {
               kind: 'select',
               title: 'Вид ссылки',
               display_scheme: '12-4-2-2',
               codeNames: {
                  '': 'Избери вид текста...',
                  'WikiLink': 'Вики-ссылка',
                  'DescriptiveLink': 'Описательная ссылка',
                  'BeingLink': 'Бытийная ссылка',
                  'ThumbLink': 'Кругляшовая ссылка',
                  'PhotoLink': 'Фото-ссылка',
               },
               validations: {
                  'Пункт из списка должен быть выбран': matchEmptyObject,
               },
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
               visible_if: { type: ["WikiLink", "DescriptiveLink", "BeingLink"] },
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
               visible_if: { type: ["WikiLink", "DescriptiveLink", "ServiceLink", "PatericLink", "BeingLink"] },
               placeholder: 'Начни ввод наименования азбуки...',
               subscribeTo: '@language_code',
               validations: {
                  'Избранная азбука не соотвествует избранному языку': matchCodes,
                  'Азбука из списка должна быть выбрана': matchEmptyObject,
               }
            },
         }
      },
      author_name: {
         kind: 'text',
         name: 'author_name',
         title: 'Автор',
         display_scheme: '12-4-6-6',
         placeholder: 'Введи имя автора(ов)',
      },
      date: {
         kind: 'text',
         name: 'date',
         title: 'Пора',
         display_scheme: '12-4-3-3',
         placeholder: 'Введи пору написания',
         validations: {
            "Дата отсутствует": matchEmptyObject,
         }
      },
      council: {
         kind: 'text',
         name: 'council',
         title: 'Собор',
         display_scheme: '12-4-3-3',
         placeholder: 'Введи сокращение собора',
      },
      meta: {
         kind: 'json',
         title: 'Метаданные',
         placeholder: 'Введи метаданные',
         display_scheme: '12-12-12-12',
         validations: {
            'Текст имеет неверный формат JSON': matchValidJson
         }
      },
   }
}
