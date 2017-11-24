import DynamicField from 'DynamicField'

export default class MemoryNameField extends DynamicField {
   static defaultProps = {
      pathname: 'names',
      name: 'name_id',
      key_name: 'name',
      value_name: 'id',
      title: 'Имя',
      placeholder: 'Избери имя...',
   }
}
