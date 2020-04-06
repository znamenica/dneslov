import PropTypes from 'prop-types'
import { mixin } from 'lodash-decorators'
import { merge } from 'merge-anything'

import CommonForm from 'CommonForm'
import { matchLanguages, matchAlphabeths, matchLetters, matchEmptyObject, matchCodes, matchEmptyCollection } from 'matchers'

export default class NameForm extends CommonForm {
   static defaultProps = {
      id: null,
      text: '',
      language_code: '',
      alphabeth_code: '',
      root_id: undefined,
      root: '',
      bind_kind: '',
      bond_to_id: undefined,
      bond_to: '',

      remoteName: 'name',
      remoteNames: 'names',

      meta: {
         text: {
            kind: 'text',
            name: 'text',
            title: 'Написание имени',
            placeholder: 'Введи написание имени',
            display_scheme: '12-6-4-4',
            validations: {
               "Имя отсутствует": matchEmptyObject,
            }
         },
         language_code: {
            kind: 'select',
            name: 'language_code',
            title: 'Язык',
            display_scheme: '12-6-4-1',
            codeNames: {
               '': 'Избери язык...',
               ру: 'Русский',
               цс: 'Церковнославянский',
               сс: 'Старославянский',
               ук: 'Украинский',
               бл: 'Белорусский',
               мк: 'Македонский',
               сх: 'Сербохорватский',
               со: 'Словенский',
               бг: 'Болгарский',
               чх: 'Чешский',
               сл: 'Словацкий',
               по: 'Польский',
               кш: 'Кашубский',
               вл: 'Верхнелужийкий',
               нл: 'Нижнелужицкий',
               ар: 'Армянский',
               ив: 'Грузинский',
               рм: 'Румынский',
               гр: 'Греческий',
               ла: 'Латинский',
               ит: 'Итальянский',
               фр: 'Французский',
               ис: 'Испанский',
               не: 'Немецкий',
               ир: 'Ирландский',
               си: 'Староирландский',
               ан: 'Английский',
               ев: 'Иврит',
            },
            validations: {
               'Избранный язык не соотвествует избранной азбуке': matchCodes,
               'Язык из списка должен быть выбран': matchEmptyObject,
            }
         },
         alphabeth_code: {
            kind: 'select',
            name: 'alphabeth_code',
            title: 'Азбука',
            display_scheme: '12-6-4-1',
            codeNames: {
               '': 'Избери азбуку...',
               ру: 'Пореформенная русская азбука',
               рп: 'Дореформенная русская азбука',
               цс: 'Церковнославянская кириллица',
               цр: 'Церковнославянская разметка (hip)',
               сс: 'Старославянкая кириллица',
               ук: 'Украинская азбука',
               ср: 'Сербская азбука (кириллица)',
               хр: 'Хорватская азубка (латиница)',
               со: 'Словнеская азбука',
               бг: 'Болгарская азбука',
               чх: 'Чешская азбука',
               сл: 'Словацкая азбука',
               по: 'Польская азбука',
               ар: 'Армянская азбука',
               ив: 'Грузинская азбука',
               рм: 'Румынская латиница',
               цу: 'Церковнославянская кириллица румынского извода',
               гр: 'Греческая азбука',
               ла: 'Латынь',
               ит: 'Итальянская азбука',
               фр: 'Французская азбука',
               ис: 'Испанская азбука',
               не: 'Немецкая азбука',
               ир: 'Ирландская азбука',
               си: 'Староирландская азбука',
               ан: 'Английская азбука',
               са: 'Среднеанглийская азбука',
               ра: 'Раннеанглийская азбука',
               ев: 'Еврейская азбука',
            },
            validations: {
               'Азбука из списка должен быть выбран': matchEmptyObject,
            }
         },
         bond_to_id: {
            kind: 'dynamic',
            title: 'Связаное имя',
            humanized_name: 'bond_to',
            display_scheme: '12-6-4-3',
            placeholder: 'Начни ввод имени...',
            pathname: 'short_names',
            key_name: 'name',
            value_name: 'id',
            validations: {
               'Связаное имя не должно соответствовать названию текущего имени': (value, context) => {
                  return value && value == context.id
               },
            }
         },
         bind_kind: {
            kind: 'select',
            title: 'Вид связки',
            display_scheme: '12-6-4-1',
            placeholder: '',
            codeNames: {
               '': 'Избери вид связки...',
               'несвязаное': 'Не связанное',
               'переводное': 'Переводное',
               'прилаженое': 'Прилаженое (Адаптация)',
               'переложеное': 'Переложеное (Транслитерация)',
               'уменьшительное': 'Уменьшительное',
               'подобное': 'Подобное (Синоним)',
            },
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
         root_id: {
            kind: 'dynamic',
            humanized_name: 'root',
            title: 'Корневое имя',
            display_scheme: '12-6-4-2',
            placeholder: 'Начни ввод имени...',
            pathname: 'short_names',
            key_name: 'name',
            value_name: 'id',
         },
      }
   }

   static getCleanState() {
      return {
         id: undefined,
         text: '',
         language_code: '',
         alphabeth_code: '',
         root_id: undefined,
         root: '',
         bind_kind: '',
         bond_to_id: undefined,
         bond_to: '',
      }
   }
}
