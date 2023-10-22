import { matchLanguages, matchAlphabeths, matchLetters, matchEmptyObject, matchCodes, matchEmptyCollection, matchValidJson, matchSelection } from 'matchers'

export const readingMeta = {
   default: 'year_date',
   remoteName: 'reading',
   remoteNames: 'readings',
   title: 'Чтения',
   new: 'Новое чтение',
   update: 'Обнови чтение',
   create: 'Создай чтение',
   close: 'Закрой',
   remove: {
      title: 'Точно ли удалить чтение %default?',
      yes: "Да"
   },
   row: {
      year_date: {
         title: 'Годовая дата',
      },
      abbreviation: {
         title: 'Сокращение',
      },
      kind: {
         title: 'Вид',
      },
      scriptum: {
         title: 'Сведённый текст',
         value: (value) => {
            return value.markups.map((x) => { return x.scriptum.slice(x.begin, x.end) }).join("")
         }
      },
   },
   form: {
      year_date: {
         kind: 'text',
         title: 'Годовая дата',
         placeholder: 'Введи годовую дату',
         data: { length: '7' },
         display_scheme: '6-6-2-2',
         validations: {
            "Слишком длинное значение даты в году": /^.{8,}$/,
            "Годовая дата отсутствует": (value, context) => {
               return !value && context.bind_kind_code != "соборный"
            },
            "В значении даты допустимы только цифры, точка, знаки отношения (%,>,<,~) или знаки + и -": /[^0-9+\.\-%<>~]/,
            "Знак отношения должен следовать за годичной датой": /^([0-9]+\.?|)[%<>~]/,
            "Опорный день после знака отношения обязателен": /^[0-9\.]+[%<>~]([^0-6]|)?$/,
            "Знак + или - может только предварять число": /^.[\-+]{1,4}$/,
            "Цифры должны быть введены обязательно": /^[\-+\.]+$/,
         }
      },
      abbreviation: {
         kind: 'text',
         title: 'Сокращение',
         display_scheme: '6-6-6-6',
         placeholder: 'Впиши сокращение',
      },
      kind: {
         kind: 'select',
         title: 'Последование',
         codeNames: {
            '': 'Избери последование...',
            'custom': 'Разное',
            'vespers': 'Вечерня',
            'matins': 'Утреня',
            'lithurgy': 'Обедня',
            'dinning': 'Обедница',
            'hours': 'Часы',
         },
         display_scheme: '6-6-4-4',
         validations: {
            'Пункт из списка должен быть выбран': matchEmptyObject,
         }
      },
      markups: {
         kind: 'collection',
         title: "Разметки",
         action: "Добавь разметку",
         display_scheme: '12-12-12-12',
         validations: {
            'Минимум одна разметка должна быть задана':  matchEmptyCollection,
         },
         meta: {
            id: {
               kind: 'hidden',
            },
            begin: {
               for: 'scriptum_id',
            },
            end: {
               for: 'scriptum_id',
            },
            scriptum_id: {
               kind: 'dynamic',
               title: 'Текст',
               display_scheme: '12-12-12-12',
               pathname: 'short_scripta',
               humanized_name: 'scriptum',
               selectable: true,
               readOnly: true,
               key_name: 'value',
               value_name: 'key',
               placeholder: 'Начни ввод текста...',
               validations: {
                  'Избранный текст отсутствует': matchEmptyObject,
                  'Текст или его часть должены быть выделены': matchSelection,
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
   }
}
