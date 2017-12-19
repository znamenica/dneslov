import DynamicField from 'DynamicField'

export default class MemoryField extends DynamicField {
   static defaultProps = {
      pathname: 'short_memories',
      name: 'memory',
      field_name: 'memory_id',
      key_name: 'short_name',
      value_name: 'id',
      title: 'Память',
      placeholder: 'Начни ввод текста имени или описания памяти...',
      validations: {
         "Память должна быть избрана": /^$/
      }
   }
}
