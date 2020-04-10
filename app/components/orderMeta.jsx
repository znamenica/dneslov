import { matchLanguages, matchAlphabeths, matchLetters, matchEmptyObject,
         matchCodes, matchEmptyCollection } from 'matchers'
import { makeTweet, makeNote, makeDescription } from 'makers'

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
         value: makeTweet
      },
      note: {
         title: 'Наименование',
         value: makeNote
      },
      description: {
         title: 'Описание',
         value: makeDescription
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
      notes: {
         kind: 'collection',
         title: "Имена",
         action: "Добавь имя",
         display_scheme: '12-12-12-12',
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
               validations: {
                  "Имя отсутствует": matchEmptyObject,
                  "Все слова должны начинаться либо с заглавной буквы, либо с цифры": /(^[^0-9А-ЯЁ]|\s[^0-9А-ЯЁа-яё])/g,
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
               key_name: 'name',
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
               key_name: 'name',
               value_name: 'key',
               placeholder: 'Начни ввод наименования азбуки...',
               validations: {
                  'Избранная азбука не соотвествует избранному языку': matchCodes,
                  'Азбука из списка должна быть выбрана': matchEmptyObject,
               }
            },
         }
      },
      tweets: {
         kind: 'collection',
         title: "Краткие имена",
         action: "Добавь краткое имя",
         display_scheme: '12-12-12-12',
         validations: {
            "Должно быть задано как минимум одно короткое имя": matchEmptyObject,
            "Языки в коротких именах не могут совпадать": matchLanguages,
            "Азбуки в коротких именах не могут совпадать": matchAlphabeths,
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
                  "В кратком имени допустимы только русские кириллические буквы, цифры и пробел": /[^А-Яа-яЁё0-9 ]/,
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
               key_name: 'name',
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
               key_name: 'name',
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
               key_name: 'name',
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
               key_name: 'name',
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
