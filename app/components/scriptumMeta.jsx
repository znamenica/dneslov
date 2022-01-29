import { matchLanguages, matchAlphabeths, matchLetters, matchEmptyObject, matchCodes, matchEmptyCollection } from 'matchers'

export const scriptumMeta = {
   default: 'scriptum',
   remoteNames: 'scripta',
   remoteName: 'scriptum',
   title: 'Тексты',
   new: 'Новый текст',
   update: 'Обнови текст',
   create: 'Создай текст',
   close: 'Закрой',
   remove: {
      title: 'Точно ли удалить текст %default?',
      yes: "Да"
   },
   row: {
      type: {
         title: 'Вид',
      },
      language_code: {
         title: 'Язык',
      },
      alphabeth_code: {
         title: 'Азбука',
      },
      tone: {
         title: 'Глас',
      },
      title: {
         title: 'Заголовок',
      },
      prosomeion_title: {
         title: 'Подобен',
      },
      ref_title: {
         title: 'Ссылка на...',
      },
      text: {
         title: 'Текст',
         value: (value) => {
            if (value.text && value.text.length > 30) {
               return value.text.slice(0, 30) + '...'
            } else {
               return value.text
            }
         },
      },
      description: {
         title: 'Описание',
         value: (value) => {
            if (value.description && value.description.length > 30) {
               return value.description.slice(0, 30) + '...'
            } else {
               return value.description
            }
         },
      },
      author: {
         title: 'Автор',
      },
   },
   form: {
      title: {
         kind: 'text',
         title: 'Написание заголовка',
         placeholder: 'Введи написание заголовка',
         display_scheme: '12-6-4-4',
      },
      prosomeion_title: {
         kind: 'text',
         title: 'Прокимен',
         placeholder: 'Введи текст прокимна',
         display_scheme: '12-6-4-4',
      },
      ref_title: {
         kind: 'text',
         title: 'Заголовочная ссылка',
         placeholder: 'Заполни текстовую ссылку',
         display_scheme: '12-6-4-4',
      },
      tone: {
         kind: 'select',
         title: 'Глас',
         codeNames: {
            '': 'Избери глас...',
            '1': '1-й',
            '2': '2-й',
            '3': '3-й',
            '4': '4-й',
            '5': '5-й',
            '6': '6-й',
            '7': '7-й',
            '8': '8-й',
         },
         display_scheme: '12-6-1-1',
      },
      type: {
         kind: 'select',
         title: 'Вид текста',
         codeNames: {
            '': 'Избери вид текста...',
            'Scriptum': 'Текст',
            'Bible': 'Библия',
            'Canto': 'Песма',
            'Chant': 'Песнопение',
            'Canticle': 'Спевна',
            'Orison': 'Моление',
            'Magnification': 'Величание',
            'Prayer': 'Молитва',
            'Irmos': 'Ирмос',
            'Ikos': 'Икос',
            'Troparion': 'Тропарь',
            'Stichira': 'Стихира',
            'Kontakion': 'Кондак',
            'Exapostilarion': 'Светилен',
            'SessionalHymn': 'Седальна',
            'Kanonion': 'Седальна канона',
            'Kathismion': 'Седальна кафизмы',
            'Polileosion': 'Седальна полиелея',
            'Apostichus': 'Апостих',
            'CryStichira': 'Воззвашна',
            'Stichiron': 'Стихирник',
         },
         display_scheme: '12-6-2-2',
         validations: {
            'Пункт из списка должен быть выбран': matchEmptyObject,
         },
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
      author: {
         kind: 'text',
         title: 'Автор',
         placeholder: 'Введи автора',
         display_scheme: '12-6-3-3',
      },
      text: {
         kind: 'tale',
         title: 'Текст',
         placeholder: 'Введи текст',
         display_scheme: '12-12-12-12',
         validations: {
            'Текст отсутствует': (value, context) => {
               return !context.ref_title && matchEmptyObject(value)
            },
            'Текст содержит знаки вне перечня избранной азбуки': matchLetters,
         }
      },
      description: {
         kind: 'tale',
         title: 'Написание описание',
         placeholder: 'Введи описание',
         display_scheme: '12-12-12-12',
         validations: {
            'Описание содержит знаки вне перечня избранной азбуки': matchLetters,
         }
      },
   },
}
