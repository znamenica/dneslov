import SelectField from 'SelectField'

export default class MemoBindKindField extends SelectField {
   static defaultProps = {
      name: 'bind_kind',
      title: 'Вид привязки к помину',
      codeNames: {
         '': 'Избери вид привязки...',
         'несвязаный': 'Не привязаный',
         'навечерие': 'Навечерие',
         'предпразднество': 'Предпразднество',
         'попразднество': 'Попразднество',
      },
      validations: {
         'Пункт из списка должен быть выбран': /^$/,
      }
   }
}
