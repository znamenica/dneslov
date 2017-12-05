import SelectField from 'SelectField'

export default class BindKindField extends SelectField {
   static defaultProps = {
      name: 'bind_kind',
      title: 'Вид связки',
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
         'Пункт из списка должен быть выбран': /^$/,
      }
   }
}
