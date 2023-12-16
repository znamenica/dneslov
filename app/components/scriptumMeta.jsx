import { matchLanguages, matchAlphabeths, matchLetters, matchEmptyObject, matchCodes, matchEmptyCollection } from 'matchers'

export const scriptumMeta = {
   default: "text", //TODO (value) => { return value.text || value.ref_title || value.title },
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
         value: (value) => {
            const scriptumTable = {
               'Prolog': 'Пролог',
               'Irmos': 'Ирмос',
               'Ikos': 'Икос',
               'Troparion': 'Тропарь',
               'Kontakion': 'Кондак',
               'Stichira': 'Стихира',
               'CryStichira': 'Воззвашна',
               'Exapostilarion': 'Светилен',
               'SessionalHymn': 'Седальна',
               'Kanonion': 'Седальна канона',
               'Kathismion': 'Седальна кафизмы',
               'Polileosion': 'Седальна полиелея',
               'Apostichus': 'Стиховна',
               'Stichiron': 'Литийна',
               'Praision': 'Хвалитна',
               'Sedation': 'Степенна',
               'Anatolion': 'Восточна',
               'Resurrexion': 'Воскресна',
               'Ipakoi': 'Ипакой', // на 17-й кафизмѣ
               'Magnification': 'Величание',
               'Prayer': 'Молитва',
               'Orison': 'Моление',
               'Canticle': 'Спевна',
               'Chant': 'Песнопение',
               'Canto': 'Песма',
               'Bible': 'Библия',
               'Scriptum': 'Текст',
            }

            return scriptumTable[value.type]
         },
      },
      language_code: {
         title: 'Язык',
      },
      alphabeth_code: {
         title: 'Азбука',
      },
      text: {
         title: 'Буке',
         value: (value) => {
            if (value.title) {
               return value.title
            } else if (value.text && value.text.length > 30) {
               return value.text.slice(0, 30) + '...'
            } else {
               return value.text
            }
         },
      },
      memo: {
         title: 'Память',
         value: (value) => { return value.memo_scripta && value.memo_scripta[0] && value.memo_scripta[0].memo_name },
      },
      tone: {
         title: 'Глас',
      },
      prosomeion_title: {
         title: 'Подобен',
      },
      ref_title: {
         title: 'Ссылка на...',
      },
      author: {
         title: 'Автор',
      },
   },
   form: {
      type: {
         kind: 'select',
         title: 'Вид текста',
         codeNames: {
            '': 'Избери вид текста...',
            'Scriptum': 'Текст',
            'Bible': 'Библия',
            'Prolog': 'Пролог',
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
            'Apostichus': 'Стиховна',
            'CryStichira': 'Воззвашна',
            'Stichiron': 'Литийна',
            'Praision': 'Хвалитна',
            'Sedation': 'Степенна',
            'Anatolion': 'Восточна',
            'Resurrexion': 'Воскресна',
            'Ipakoi': 'Ипакой' // на 17-й кафизмѣ
         },
         display_scheme: '12-6-3-3',
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
         subscribeTo: '@alphabeth_code',
         validations: {
            'Текст отсутствует': (value, context) => {
               return !context.ref_title && matchEmptyObject(value)
            },
            'Текст содержит знаки вне перечня избранной азбуки': matchLetters,
         }
      },
      tone: {
         kind: 'select',
         title: 'Глас',
         visible_if: { type: [
            "Irmos", "Troparion", "Stichira", "Kontakion", "Exapostilarion", "SessionalHymn",
            "Kanonion", "Kathismion", "Polileosion", "Apostichus", "CryStichira",
            "Stichiron", "Praision", "Sedation", "Anatolion", "Resurrexion", "Ipakoi"] },
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
      title: {
         kind: 'text',
         title: 'Написание заголовка',
         visible_if: { type: [
            "Irmos", "Troparion", "Stichira", "Kontakion", "Exapostilarion", "SessionalHymn",
            "Kanonion", "Kathismion", "Polileosion", "Apostichus", "CryStichira",
            "Stichiron", "Praision", "Sedation", "Anatolion", "Resurrexion", "Ipakoi"] },
         placeholder: 'Введи написание заголовка',
         display_scheme: '12-6-3-3',
      },
      prosomeion_title: {
         kind: 'text',
         title: 'Подобен',
         visible_if: { type: [
            "Irmos", "Troparion", "Stichira", "Kontakion", "Exapostilarion", "SessionalHymn",
            "Kanonion", "Kathismion", "Polileosion", "Apostichus", "CryStichira",
            "Stichiron", "Praision", "Sedation", "Anatolion", "Resurrexion", "Ipakoi"] },
         placeholder: 'Введи текст подобна',
         display_scheme: '12-6-4-4',
      },
      ref_title: {
         kind: 'text',
         title: 'Заголовочная ссылка',
         visible_if: { type: [
            "Irmos", "Troparion", "Stichira", "Kontakion", "Exapostilarion", "SessionalHymn",
            "Kanonion", "Kathismion", "Polileosion", "Apostichus", "CryStichira",
            "Stichiron", "Praision", "Sedation", "Anatolion", "Resurrexion", "Ipakoi"] },
         placeholder: 'Заполни текстовую ссылку',
         display_scheme: '12-6-4-4',
      },
      memo_scripta: {
         kind: 'collection',
         title: "Памятные отношения",
         action: "Добавь отношение",
         display_scheme: '12-12-12-12',
         validations: {
            'Минимум одно отношение должно быть задано': (value, context) => {
               if (matchEmptyObject(value, context)) { return true }
            }
         },
         meta: {
            id: {
               kind: 'hidden',
            },
            kind: {
               kind: 'select',
               title: 'Род отношения',
               display_scheme: '12-6-3-3',
               codeNames: {
                  '': 'Избери вид отношения...',
                  'From': 'Обращение от...',
                  'To': 'Обращение к...',
                  'About': 'Текст о...',
                  'Author': 'Автор',
               },
               validations: {
                  'Пункт из списка должен быть выбран': matchEmptyObject,
               },
            },
            memo_id: {
               kind: 'dynamic',
               title: 'Память',
               humanized_name: 'memo_name',
               display_scheme: '12-6-9-9',
               placeholder: 'Начни ввод текста имени или описания памяти...',
               pathname: 'short_full_memoes',
               key_name: 'value',
               value_name: 'key',
               validations: {
                  'Память должна быть избрана':  matchEmptyObject,
               }
            },
         }
      },
      description: {
         kind: 'tale',
         title: 'Написание описание',
         placeholder: 'Введи описание',
         display_scheme: '12-12-12-12',
         subscribeTo: '@alphabeth_code',
         validations: {
            'Описание содержит знаки вне перечня избранной азбуки': matchLetters,
         }
      },
   },
}
