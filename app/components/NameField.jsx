import DynamicField from 'DynamicField'

export default class NameField extends DynamicField {
   static defaultProps = {
      pathname: 'short_names',
      name: 'name_id',
      key_name: 'name',
      value_name: 'id',
      title: 'Имя',
      placeholder: 'Начни ввод имени...',
   }
}
