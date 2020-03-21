import LanguagedTextField from 'LanguagedTextField'
import NameField from 'NameField'
import NameBindKindField from 'NameBindKindField'
import CommonForm from 'CommonForm'
import ErrorSpan from 'ErrorSpan'
import { matchLetters, matchCodes } from 'matchers'

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
      child_validations: {
         'Избранный язык не соотвествует избранной азбуке': matchCodes,
         'Набранный текст содержит знаки вне перечня избранной азбуки': matchLetters,
      },
      child_value_validations: {
         "Имя отсутствует": /^$/
      },

      remoteName: 'name',
      remoteNames: 'names',
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

   renderContent() {
      return [
         <LanguagedTextField
            key='languagedTextField'
            title='Написание имени'
            placeholder='Введи написание имени'
            value={this.state.query}
            value_validations={this.props.child_value_validations}
            validations={this.props.child_validations}
            key_name='text' />,
         <NameField
            key='bondTo'
            name='bond_to_id'
            humanized_name='bond_to'
            title='Связаное имя'
            value={this.state.query.bond_to_id}
            humanized_value={this.state.query.bond_to}
            wrapperClassName='input-field col xl4 l4 m6 s12' />,
         <NameBindKindField
            key='bindKind'
            name='bind_kind'
            value={this.state.query.bind_kind}
            wrapperClassName='input-field col xl4 l4 m6 s12' />,
         <NameField
            key='root'
            name='root_id'
            humanized_name='root'
            title='Корневое имя'
            value={this.state.query.root_id}
            humanized_value={this.state.query.root}
            wrapperClassName='input-field col xl4 l4 m12 s12' />,
         <ErrorSpan
            appendClassName='col xl12 l12 m12 s12'
            error={this.getErrorText(this.state.query)} />]}}
