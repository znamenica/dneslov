import DynamicField from 'DynamicField'

export default class NameField extends DynamicField {
   static defaultProps = {
      pathname: 'short_names',
      humanized_name: 'name_text',
      name: 'name_id',
      humanized_value: undefined,
      value: undefined,
      key_name: 'name',
      value_name: 'id',
      title: 'Имя',
      placeholder: 'Начни ввод имени...',
      validations: {},
   }
}
