import { matchLanguages, matchAlphabeths, matchLetters, matchEmptyObject, matchCodes, matchEmptyCollection } from 'matchers'
import UrlRegexp from 'UrlRegexp'

export const memoMeta = {
   default: 'memory',
   remoteNames: 'memoes',
   remoteName: 'memo',
   title: 'Помины',
   new: 'Новый помин',
   update: 'Обнови память',
   create: 'Создай память',
   close: 'Закрой',
   remove: {
      title: 'Точно ли удалить помин %default?',
      yes: "Да"
   },
   row: {
      order: {
         title: 'Чин',
         value: (value) => { return value.memo_orders && value.memo_orders[0] && value.memo_orders[0].order },
      },
      memory: {
         title: 'Память',
         value: (value) => { return value.memory_name },
      },
      year_date: {
         title: 'Дата',
      },
      event: {
         title: 'Событие',
         value: (value) => { return value.event_short_title },
      },
      bond_to: {
         title: 'Связка с...',
         value: (value) => { return value.bond_to_year_date },
      },
      add_date: {
         title: 'Добавлено...',
      },
      calendary: {
         title: 'Календарь',
         value: (value) => { return value.calendary_title },
      }
   },
   form: {
      calendary_id: {
         kind: 'dynamic',
         title: 'Календарь',
         humanized_name: 'calendary_title',
         pathname: 'short_calendaries',
         key_name: 'value',
         value_name: 'key',
         placeholder: 'Начни ввод наименования календаря...',
         display_scheme: '12-6-4-4',
         validations: {
            "Календарь должен быть избран": /^$/
         }
      },
      memory_id: {
         kind: 'dynamic',
         humanized_name: 'memory_name',
         display_scheme: '12-6-4-4',
         pathname: 'short_memories',
         key_name: 'value',
         value_name: 'key',
         title: 'Память',
         placeholder: 'Начни ввод текста имени или описания памяти...',
         validations: {
            "Память должна быть избрана": /^$/
         }
      },
      event_id: {
         kind: 'dynamic',
         context_names: 'memory_id',
         humanized_name: 'event_short_title',
         pathname: 'short_events',
         key_name: 'value',
         value_name: 'key',
         title: 'Событие',
         placeholder: 'Начни ввод имени события...',
         display_scheme: '12-6-4-4',
         validations: {
            "Событие должно быть избрано": /^$/
         }
      },
      year_date: {
         kind: 'text',
         title: 'Дата в году',
         placeholder: 'Введи дату в году',
         data: { length: '7' },
         display_scheme: '12-6-2-2',
         validations: {
            "Слишком длинное значение даты в году": /^.{8,}$/,
            "Дата в году отсутствует": matchEmptyObject,
            "В значении даты допустимы только цифры, точка, процент или знаки + и -": /[^0-9+\.\-%]/,
            "Процент должен следовать за датой года": /^([0-9]+\.?|)%/,
            "Опорный день после знака процент обязателен": /^[0-9\.]+%([^0-6]|)?$/,
            "Знак + или - может только предварять число": /^.[\-+]{1,4}$/,
            "Цифры должны быть введены обязательно": /^[\-+\.]+$/,
         }
      },
      bind_kind_code: {
         kind: 'select',
         title: 'Вид привязки к помину',
         codeNames: {
            '': 'Избери вид привязки...',
            'несвязаный': 'Не привязаный',
            'навечерие': 'Навечерие',
            'предпразднество': 'Предпразднество',
            'попразднество': 'Попразднество',
         },
         display_scheme: '12-6-3-3',
         validations: {
            'Пункт из списка должен быть выбран': matchEmptyObject,
            'Вид привязки не должен иметь значение "Не привязаный" в случае, если привязка задана': (value, context) => {
               return context.bond_to_id && value == "несвязаный"
            },
            'Вид привязки должен иметь значение "Не привязаный" в случае, если привязка отсутствует': (value, context) => {
               return !context.bond_to_id && value != "несвязаный"
            },
         }
      },
      bond_to_id: {
         kind: 'dynamic',
         title: 'Привязаный помин',
         humanized_name: 'bond_to_year_date',
         display_scheme: '12-6-4-4',
         placeholder: 'Начни ввод даты привязаного помина...',
         pathname: 'short_memoes',
         key_name: 'value',
         value_name: 'key',
         context_names: [ 'event_id', 'calendary_id' ],
         validations: {
            'Привязаная дата не должна соответствовать текущей дате': (value, context) => {
               return value && context.bond_to == context.year_date
            }
         },
      },
      add_date: {
         kind: 'text',
         title: 'Пора добавления',
         placeholder: 'Введи пору',
         display_scheme: '12-6-3-3',
         validations: {
            "Пора отсутствует":matchEmptyObject,
         }
      },
      memo_orders: {
         kind: 'collection',
         title: 'Чины',
         action: 'Добавь чин',
         display_scheme: '12-12-12-12',
         validations: {
            "Языки в чинах не могут совпадать": matchLanguages,
            "Азбуки в чинах не могут совпадать": matchAlphabeths,
            'Минимум один чин должен быть задан':  matchEmptyObject
         },
         meta: {
            id: {
               kind: 'hidden',
            },
            order_id: {
               kind: 'dynamic',
               title: 'Чин',
               pathname: 'short_orders',
               humanized_name: 'order',
               key_name: 'value',
               value_name: 'key',
               placeholder: 'Начни ввод наименования чина...',
               display_scheme: '12-12-12-12',
               validations: {
                  "Чин отсутствует": matchEmptyObject,
                  'Чин содержит знаки вне перечня избранной азбуки': matchLetters,
               }
            },
         }
      },
      titles: {
         kind: 'collection',
         title: 'Заголовки',
         action: 'Добавь заголовок',
         single: 'Заголовок',
         placeholder: 'Введи заголовок',
         source: "descriptions",
         filter: { type: "Title" },
         display_scheme: '12-12-12-12',
         validations: {
            "Языки в заголовках не могут совпадать": matchLanguages,
            "Азбуки в заголовках не могут совпадать": matchAlphabeths,
            'Минимум один заголовок должен быть задан':  matchEmptyObject
         },
         meta: {
            id: {
               kind: 'hidden',
            },
            text: {
               kind: 'tale',
               title: 'Заголовок',
               placeholder: 'Введи заголовок',
               display_scheme: '12-12-12-12',
               validations: {
                  "Заголовок отсутствует": matchEmptyObject,
                  'Заголовок содержит знаки вне перечня избранной азбуки': matchLetters,
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
      links: {
         kind: 'collection',
         title: 'Ссылки',
         action: 'Добавь ссылку',
         single: 'Ссылка',
         placeholder: 'Введи ссылку',
         display_scheme: '12-12-12-12',
         validations: {
            "Языки в ссылках не могут совпадать": matchLanguages,
            "Азбуки в ссылках не могут совпадать": matchAlphabeths,
         },
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
   },
}
