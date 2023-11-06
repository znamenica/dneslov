import { matchLanguages, matchAlphabeths, matchLetters, matchEmptyObject, matchCodes, matchEmptyCollection, matchValidUrl } from 'matchers'
import { makeCouncil, makeDate, makeDescription } from 'makers'

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
               display_scheme: '12-3-2-2',
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
            "В кратком имени допустимы только русские кириллические буквы, цифры, дефис, запятая и пробел": /[^А-Яа-яЁё0-9 \,\-]/,
            "Все слова должны начинаться либо с заглавной буквы, либо с цифры": /(^[^0-9А-ЯЁ]|\s[^0-9А-ЯЁа-яё])/g,
         }
      },
      base_year: {
         kind: 'text',
         display_scheme: '12-3-2-2',
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
      quantity: {
         kind: 'text',
         title: 'Количество',
         placeholder: 'Введи количество',
         display_scheme: '12-6-1-1',
         validations: {
            'Неверный формат поля: допустимые знаки - цифры, вопрос и плюс': /[^0-9\?\+]/,
         }
      },
      council: {
         kind: 'text',
         title: 'Собор',
         placeholder: 'Введи сокращение собора',
         display_scheme: '12-6-4-4',
      },
      place_id: {
         kind: 'dynamic',
         display_scheme: '12-6-4-4',
         title: 'Покровительство',
         pathname: 'short_places',
         humanized_name: 'place',
         name: 'place_id',
         key_name: 'value',
         value_name: 'key',
         placeholder: 'Начни ввод наименования места...',
      },
      memory_binds: {
         kind: 'collection',
         title: 'Связанные памяти',
         action: 'Добавь связанную память',
         single: 'Связанная память',
         placeholder: 'Задай связанную память',
         display_scheme: '12-12-12-12',
         meta: {
            id: {
               kind: 'hidden',
            },
            kind: {
               kind: 'select',
               title: 'Вид связки',
               display_scheme: '12-6-3-2',
               codeNames: {
                  '': 'Избери вид связки...',
                  'Source': 'Источник (списка)', // для списков икон
                  'Base': 'Опора (иконы)',
                  'Similar': 'Подобие',
               },
               validations: {
                  'Пункт из списка должен быть выбран': matchEmptyObject,
               },
            },
            bond_to_id: {
               kind: 'dynamic',
               title: 'Память',
               display_scheme: '12-6-9-10',
               pathname: 'short_memories',
               humanized_name: 'bond_to_name',
               key_name: 'value',
               value_name: 'key',
               placeholder: 'Начни ввод связанной памяти...',
               validations: {
                  'Связанная память должна быть выбрана': matchEmptyObject,
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
      notes: {
         kind: 'collection',
         display_scheme: '12-12-12-12',
         title: 'Заметки',
         action: 'Добавь заметку',
         textField: true,
         source: "descriptions",
         filter: { type: "Note" },
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
               subscribeTo: '@alphabeth_code',
               validations: {
                  "Заметка отсутствует": matchEmptyObject,
                  'Заметка содержит знаки вне перечня избранной азбуки': matchLetters,
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
                  'CoordLink': 'Кординатная ссылка',
                  'ServiceLink': 'Службовая ссылка',
                  'PatericLink': 'Отечная ссылка',
                  'BeingLink': 'Бытийная ссылка',
                  'PhotoLink': 'Фото-ссылка',
                  'LanguageLink': 'Языковая ссылка',
                  'ThumbLink': 'Кругляшовая ссылка',
                  'IconLink': 'Иконная ссылка',
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
               visible_if: { type: ["WikiLink", "DescriptiveLink", "ServiceLink", "PatericLink", "BeingLink"] },
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
      memory_names: {
         kind: 'collection',
         title: "Имена",
         action: "Добавь имя",
         display_scheme: '12-12-12-12',
         subscribeTo: '@quantity',
         validations: {
            'Минимум одно имя должно быть задано': (value, context) => {
               if (!context.quantity && matchEmptyObject(value, context)) { return true }
            }
         },
         meta: {
            id: {
               kind: 'hidden',
            },
            nomen_id: {
               kind: 'dynamic',
               title: 'Имя',
               humanized_name: 'name',
               display_scheme: '12-4-3-3',
               placeholder: 'Начни ввод имени...',
               pathname: 'short_nomina',
               key_name: 'value',
               value_name: 'key',
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
               key_name: 'value',
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
            kind_code: {
               kind: 'dynamic',
               title: 'Вид события',
               placeholder: 'Начни ввод наименования вида события...',
               display_scheme: '12-6-4-2',
               pathname: 'short_subjects',
               humanized_name: 'kind_name',
               context_value: { k: "EventKind" },
               key_name: 'value',
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
               display_scheme: '12-12-5-3',
               title: 'Место происшествия',
               pathname: 'short_places',
               humanized_name: 'place',
               name: 'place_id',
               key_name: 'value',
               value_name: 'key',
               placeholder: 'Начни ввод наименования места...',
            },
            item_id: {
               kind: 'dynamic',
               display_scheme: '12-6-6-2',
               title: 'Предмет',
               pathname: 'short_items',
               humanized_name: 'item',
               name: 'item_id',
               key_name: 'value',
               value_name: 'key',
               placeholder: 'Начни ввод наименования предмета...',
            },
            person_name: {
               kind: 'text',
               title: 'Имя связанной личности...',
               placeholder: 'Введи имя',
               display_scheme: '12-6-6-3',
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
                     subscribeTo: '@alphabeth_code',
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
                     display_scheme: '12-6-4-3',
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
               title: "Описание события",
               action: "Добавь описание",
               display_scheme: '12-12-12-12',
               meta: {
                  id: {
                     kind: 'hidden',
                  },
                  text: {
                     kind: 'text',
                     name: 'text',
                     title: 'Текст описания',
                     placeholder: 'Введи текст описания',
                     display_scheme: '12-6-4-6',
                     subscribeTo: '@alphabeth_code',
                     validations: {
                        "Описание отсутствует": matchEmptyObject,
                     },
                  },
                  language_code: {
                     kind: 'dynamic',
                     title: 'Язык',
                     display_scheme: '12-6-4-3',
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
                     display_scheme: '12-6-4-3',
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
            }
         }
      },
   }
}
