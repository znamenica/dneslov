import PropTypes from 'prop-types'

import SlugField from 'SlugField'
import LanguageField from 'LanguageField'
import AlphabethField from 'AlphabethField'
import LicitBox from 'LicitBox'
import NamesAsDescriptionsCollection from 'NamesAsDescriptionsCollection'
import DescriptionsCollection from 'DescriptionsCollection'
import WikiesCollection from 'WikiesCollection'
import LinksCollection from 'LinksCollection'
import TextField from 'TextField'
import ErrorSpan from 'ErrorSpan'
import CommonForm from 'CommonForm'
import { matchCodes } from 'matchers'

export default class CalendaryForm extends CommonForm {
   static defaultProps = {
      id: undefined,
      licit: false,
      slug: {text: ''},
      language_code: '',
      alphabeth_code: '',
      author_name: '',
      date: '',
      council: '',
      names: [],
      descriptions: [],
      wikies: [],
      links: [],

      remoteName: 'calendary',
      remoteNames: 'calendaries',
   }

   static validations = {
      'Избранный язык не соотвествует избранной азбуке': matchCodes,
   }

   static propTypes = {
      id: PropTypes.number,
      slug: PropTypes.object,
      licit: PropTypes.bool,
      language_code: PropTypes.string,
      alphabeth_code: PropTypes.string,
      author_name: PropTypes.string,
      date: PropTypes.string,
      council: PropTypes.string,
      names: PropTypes.array,
      wikies: PropTypes.array,
      descriptions: PropTypes.array,
      links: PropTypes.array,
   }
/*
   static getDerivedStateFromProps(props, state) {
      return {
         id: props.id,
         licit: props.licit,
         slug: props.slug,
         language_code: props.language_code,
         alphabeth_code: props.alphabeth_code,
         author_name: props.author_name,
         date: props.date,
         council: props.council,
         names: props.names,
         descriptions: props.descriptions,
         wikies: props.wikies,
         links: props.links,
      }
   }
*/
   static getCleanState() {
      return {
         id: null,
         licit: false,
         slug: {text: ''},
         language_code: '',
         alphabeth_code: '',
         author_name: '',
         date: '',
         council: '',
         names: [],
         descriptions: [],
         wikies: [],
         links: [],
      }
   }

   renderContent() {
      return [
         <SlugField
            key='slug'
            value={this.state.query.slug.text}
            wrapperClassName='input-field col xl2 l2 m4 s12' />,
         <LanguageField
            key='languageField'
            value={this.state.query.language_code}
            wrapperClassName='input-field col xl4 l4 m8 s12' />,
         <AlphabethField
            key='alphabethField'
            value={this.state.query.alphabeth_code}
            wrapperClassName='input-field col xl4 l4 m8 s12' />,
         <LicitBox
            key='licitBox'
            value={this.state.query.licit}
            wrapperClassName='input-field col xl2 l2 m4 s12' />,
         <NamesAsDescriptionsCollection
            key='names'
            value={this.state.query.names} />,
         <DescriptionsCollection
            key='descriptions'
            value={this.state.query.descriptions} />,
         <WikiesCollection
            key='wikies'
            value={this.state.query.wikies} />,
         <LinksCollection
            key='links'
            value={this.state.query.links} />,
         <TextField
            key='authorName'
            name='author_name'
            title='Автор'
            placeholder='Введи имя автора(ов)'
            value={this.state.query.author_name}
            wrapperClassName='input-field col xl6 l6 m4 s12' />,
         <TextField
            key='date'
            name='date'
            title='Пора'
            placeholder='Введи пору написания'
            value={this.state.query.date}
            validations={{'Дата отсутствует': /^$/}}
            wrapperClassName='input-field col xl3 l3 m4 s12' />,
         <TextField
            key='council'
            name='council'
            title='Собор'
            placeholder='Введи сокращение собора'
            value={this.state.query.council}
            wrapperClassName='input-field col xl3 l3 m4 s12' />,
         <ErrorSpan
            appendClassName='col xl12 l12 m12 s12'
            error={this.getErrorText(this.state)} />]
   }
}
 
