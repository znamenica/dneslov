import LanguagedTextField from 'LanguagedTextField'
import NameField from 'NameField'
import NameBindKindField from 'NameBindKindField'
import CommonForm from 'CommonForm'
import ErrorSpan from 'ErrorSpan'

export default class NameForm extends CommonForm {
   static defaultProps = {
      id: null,
      text: '',
      language_code: '',
      alphabeth_code: '',
      root_id: '',
      root: '',
      bind_kind: '',
      bond_to_id: '',
      bond_to: '',
   }

   static validations = {
      'Вид связки не должен иметь значение "Не связанное" в случае, если связаное имя задано': (query) => {
         return query.bond_to_id && query.bind_kind == "несвязаное"
      },
      'Вид связки должен иметь значение "Не связанное" в случае, если связаное имя отсутствует': (query) => {
         return !query.bond_to_id && query.bind_kind != "несвязаное"
      },
      'Связаное имя не должно соответствовать названию текущего имени': (query) => {
         return query.bond_to && query.bond_to == query.text
      },
   }

   render() {
      console.log(this.props)
      console.log(this.query)

      return (
         <div>
            <LanguagedTextField
               key='languagedTextField'
               ref={e => this.r.push(e)}
               title='Написание имени'
               placeholder='Введи написание имени'
               text={this.query.text}
               language_code={this.query.language_code}
               alphabeth_code={this.query.alphabeth_code}
               value_validations={this.props.child_value_validations}
               validations={this.props.child_validations}
               key_name='text'
               onUpdate={this.onChildUpdate.bind(this)} />
               <NameField
                  ref={e => this.r.push(e)}
                  key='bondTo'
                  field_name='bond_to_id'
                  name='bond_to'
                  title='Связаное имя'
                  bond_to_id={this.query.bond_to_id}
                  bond_to={this.query.bond_to}
                  wrapperClassName='input-field col xl4 l4 m6 s12'
                  onUpdate={this.onChildUpdate.bind(this)} />
               <NameBindKindField
                  ref={e => this.r.push(e)}
                  key='bindKind'
                  name='bind_kind'
                  bind_kind={this.query.bind_kind}
                  wrapperClassName='input-field col xl4 l4 m6 s12'
                  onUpdate={this.onChildUpdate.bind(this)} />
               <NameField
                  ref={e => this.r.push(e)}
                  key='root'
                  field_name='root_id'
                  name='root'
                  title='Корневое имя'
                  root_id={this.query.root_id}
                  root={this.query.root}
                  wrapperClassName='input-field col xl4 l4 m12 s12'
                  onUpdate={this.onChildUpdate.bind(this)} />
               <div className='col'>
                  <ErrorSpan
                     ref={e => this.$error = e}
                     error={this.getError(this.query)}
                     key='error' /></div></div>)}}
