import { matchLanguages, matchAlphabeths, matchLetters, matchEmptyObject, matchCodes, matchEmptyCollection } from 'matchers'
import { makeCouncil, makeDate, makeDescription } from 'makers'
import UrlRegexp from 'UrlRegexp'

export const memoryMeta = {
   default: 'short_name',
   remoteName: 'memory',
   remoteNames: 'memories',
   title: 'Памяти',
   new: 'Новая память',
   update: 'Обнови память',
   create: 'Создай память',
   close: 'Закрой',
   remove: {
      title: 'Точно ли удалить память %default?',
      yes: "Да"
   },
   row: {
      short_name: {
         title: 'Краткое имя',
      },
      order: {
         title: 'Чин',
         value: (value) => {
            return value.memo_orders && value.memo_orders[0]?.order || value.order
         },
      },
      council: {
         title: 'Собор',
         value: makeCouncil
      },
      quantity: {
         title: 'Кол-во',
      },
      date: {
         title: 'Пора',
         value: makeDate
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
               display_scheme: '12-4-2-2',
               validations: {
                  "Слишком большое имя жетона": /^.{7,}$/,
                  "Жетон отсутствует": matchEmptyObject,
                  "В имени жетона допустимы только русская кириллица и цифры": /[^ёа-я0-9]/
               }
            }
         }
      },
      short_name: {
         kind: 'text',
         display_scheme: '12-6-3-3',
         title: 'Краткое имя',
         placeholder: 'Введи краткое имя',
         validations: {
            "Краткое имя отсутствует": /^$/,
            "В кратком имени допустимы только русские кириллические буквы, цифры и пробел": /[^А-Яа-яЁё0-9 ]/,
            "Все слова должны начинаться либо с заглавной буквы, либо с цифры": /(^[^0-9А-ЯЁ]|\s[^0-9А-ЯЁа-яё])/g,
         }
      },
      base_year: {
         kind: 'text',
         display_scheme: '12-6-3-3',
         title: 'Опорный год',
         placeholder: 'Введи опорный год',
         data: {length: '5'},
         validations: {
            "Слишком длинное значение опорного года": /^.{6,}$/,
            "Опорный год отсутствует": /^$/,
            "В значении опорного года допустимы только цифры и знак минус": /[^0-9\\-]/,
            "Минус может только предварять число": /^.[\\-]{1,4}$/,
            "Цифры должны быть введены обязательно": /^-$/,
         }
      },
      place_id: {
         kind: 'dynamic',
         display_scheme: '12-6-4-4',
         title: 'Покровительство',
         pathname: 'short_places',
         humanized_name: 'place',
         name: 'place_id',
         key_name: 'name',
         value_name: 'id',
         placeholder: 'Начни ввод наименования места...',
      },
      council: {
         kind: 'text',
         title: 'Собор',
         placeholder: 'Введи сокращение собора',
         display_scheme: '12-6-3-3',
      },
      quantity: {
         kind: 'text',
         title: 'Количество',
         placeholder: 'Введи количество',
         display_scheme: '12-6-3-3',
      },
      bond_to_id: {
         kind: 'dynamic',
         title: 'Привязаный образ',
         humanized_name: 'bond_to',
         display_scheme: '12-6-6-6',
         placeholder: 'Начни ввод имени образа...',
         pathname: 'short_memoes',
         key_name: 'memo',
         value_name: 'id',
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
      notes: {
         kind: 'collection',
         display_scheme: '12-12-12-12',
         title: 'Заметки',
         action: 'Добавь заметку',
         textField: true,
         validations: {
            "Языки в заметках не могут совпадать": matchLanguages,
            "Азбуки в заметках не могут совпадать": matchAlphabeths,
         },
         meta: {
            id: {
               kind: 'hidden',
            },
            text: {
               kind: 'tale',
               title: 'Заметка',
               placeholder: 'Введи заметку',
               display_scheme: '12-12-12-12',
               validations: {
                  "Заметка отсутствует": matchEmptyObject,
                  'Заметка содержит знаки вне перечня избранной азбуки': matchLetters,
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
      beings: {
         kind: 'collection',
         display_scheme: '12-12-12-12',
         title: 'Бытия',
         action: 'Добавь ссылку на бытие',
         placeholder: 'Введи ссылку на бытие',
         meta: {
            id: {
               kind: 'hidden',
            },
            url: {
               kind: 'text',
               title: 'Ссылка',
               placeholder: 'Введи ссылка',
               display_scheme: '12-12-6-6',
               validations: {
                  "Ссылка отсутствует": matchEmptyObject,
                  "Неверный формат ссылки на бытие": [ "!", UrlRegexp ],
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
      wikies: {
         kind: 'collection',
         display_scheme: '12-12-12-12',
         title: 'Вики-ссылки',
         action: 'Добавь вики-ссылку',
         placeholder: 'Введи вики-ссылку',
         meta: {
            id: {
               kind: 'hidden',
            },
            url: {
               kind: 'text',
               title: 'Вики-ссылка',
               placeholder: 'Введи вики-ссылку',
               display_scheme: '12-12-6-6',
               validations: {
                  "Вики-ссылка отсутствует": matchEmptyObject,
                  "Неверный формат вики-ссылки": [ "!", UrlRegexp ],
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
      paterics: {
         kind: 'collection',
         display_scheme: '12-12-12-12',
         title: 'Отечники',
         action: 'Добавь отечник',
         placeholder: 'Введи ссылку на отечник',
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
      memory_names: {
         kind: 'collection',
         key_name: 'url',
         title: "Имена",
         action: "Добавь имя",
         display_scheme: '12-12-12-12',
         validations: {
            'Минимум одно имя должно быть задано':  matchEmptyCollection
         },
         meta: {
            id: {
               kind: 'hidden',
            },
            name_id: {
               kind: 'dynamic',
               title: 'Имя',
               humanized_name: 'name',
               display_scheme: '12-4-3-3',
               placeholder: 'Начни ввод имени...',
               pathname: 'short_names',
               key_name: 'name',
               value_name: 'id',
               validations: {
                  'Имя должно быть задано':  matchEmptyObject,
               }
            },
            state_code: {
               kind: 'dynamic',
               title: 'Род имени',
               placeholder: 'Начни ввод наименования рода имени...',
               display_scheme: '12-4-4-4',
               pathname: 'short_subjects',
               humanized_name: 'state_name',
               context_value: { k: "NameKind" },
               key_name: 'name',
               value_name: 'key',
               validations: {
                  'Пункт из списка должен быть выбран': /^$/,
               }
            },
            mode: {
               kind: 'select',
               title: 'Связка',
               display_scheme: '12-4-3-3',
               codeNames: {
                  undefined: 'Без связки',
                  'ored': 'Или...',
                  'prefix': 'Префикс',
               },
            },
            feasible: {
               kind: 'boolean',
               title: 'Предполагается',
               display_scheme: '12-4-2-2',
            },
         }
      },
      events: {
         kind: 'collection',
         title: "События",
         action: "Добавь событие",
         display_scheme: '12-12-12-12',
         validations: {
            'Минимум одно событие должно быть задано':  matchEmptyCollection
         },
         meta: {
            id: {
               kind: 'hidden',
            },
            kind: {
               kind: 'dynamic',
               title: 'Вид события',
               placeholder: 'Начни ввод наименования вида события...',
               display_scheme: '12-6-4-2',
               pathname: 'short_subjects',
               humanized_name: 'kind_name',
               context_value: { k: "EventKind" },
               key_name: 'name',
               value_name: 'key',
               validations: {
                  'Пункт из списка должен быть выбран': matchEmptyObject,
               },
            },
            happened_at: {
               kind: 'text',
               title: 'Случилось в...',
               placeholder: 'Введи пору',
               display_scheme: '12-6-3-2',
               validations: {
                  'Время должно быть задано':  matchEmptyObject
               }
            },
            place_id: {
               kind: 'dynamic',
               display_scheme: '12-4-5-3',
               title: 'Место происшествия',
               pathname: 'short_places',
               humanized_name: 'place',
               name: 'place_id',
               key_name: 'name',
               value_name: 'id',
               placeholder: 'Начни ввод наименования места...',
            },
            item_id: {
               kind: 'dynamic',
               display_scheme: '12-4-6-2',
               title: 'Предмет',
               pathname: 'short_items',
               humanized_name: 'item',
               name: 'item_id',
               key_name: 'name',
               value_name: 'id',
               placeholder: 'Начни ввод наименования предмета...',
            },
            person_name: {
               kind: 'text',
               title: 'Имя связанной личности...',
               placeholder: 'Введи имя',
               display_scheme: '12-4-6-3',
            },
            titles: {
               kind: 'collection',
               title: "Наименования события",
               action: "Добавь наименование",
               display_scheme: '12-12-12-12',
               meta: {
                  id: {
                     kind: 'hidden',
                  },
                  text: {
                     kind: 'text',
                     name: 'text',
                     title: 'Написание наименования',
                     placeholder: 'Введи написание наименования',
                     display_scheme: '12-6-4-6',
                     validations: {
                        "Имя отсутствует": matchEmptyObject,
                     },
                  },
                  language_code: {
                     kind: 'dynamic',
                     title: 'Язык',
                     display_scheme: '12-6-4-3',
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
                     display_scheme: '12-6-4-3',
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
            }
         }
      },
   }
}
