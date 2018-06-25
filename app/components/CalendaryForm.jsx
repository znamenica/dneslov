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

   static propTypes = {
      slug: PropTypes.object,
      licit: PropTypes.bool,
      language_code: PropTypes.string,
      alphabeth_code: PropTypes.string,
   }

   static validations = {
      'Избранный язык не соотвествует избранной азбуке': matchCodes,
   }

   render() {
      console.log("props", this.props)
      console.log("query", this.query)

      return (
         <div>
            <div className='row'>
               <SlugField
                  ref={e => this.r.push(e)}
                  key='slug'
                  slug={this.query.slug}
                  wrapperClassName='input-field col xl2 l2 m4 s12'
                  onUpdate={this.onChildUpdate.bind(this)} />
               <LanguageField
                  ref={e => this.r.push(e)}
                  key='languageField'
                  language_code={this.query.language_code}
                  wrapperClassName='input-field col xl4 l4 m8 s12'
                  onUpdate={this.onChildUpdate.bind(this)} />
               <AlphabethField
                  ref={e => this.r.push(e)}
                  key='alphabethField'
                  alphabeth_code={this.query.alphabeth_code}
                  wrapperClassName='input-field col xl4 l4 m8 s12'
                  onUpdate={this.onChildUpdate.bind(this)} />
               <LicitBox
                  ref={e => this.r.push(e)}
                  key='licitBox'
                  licit={this.query.licit}
                  wrapperClassName='fake-input-field col xl2 l2 m4 s12'
                  onUpdate={this.onChildUpdate.bind(this)} /></div>
            <div className='row'>
               <div className='col'>
                  <ErrorSpan
                     ref={e => this.$error = e}
                     key='error' /></div></div>
            <div className='row'>
               <div className='col l12 s12'>
                  <NamesAsDescriptionsCollection
                     ref={e => this.r.push(e)}
                     key='names'
                     value={this.query.names}
                     onUpdate={this.onChildUpdate.bind(this)} /></div></div>
            <div className='row'>
               <div className='col l12 s12'>
                  <DescriptionsCollection
                     ref={e => this.r.push(e)}
                     key='descriptions'
                     value={this.query.descriptions}
                     onUpdate={this.onChildUpdate.bind(this)} /></div></div>
            <div className='row'>
               <div className='col l12 s12'>
                  <WikiesCollection
                     ref={e => this.r.push(e)}
                     key='wikies'
                     value={this.query.wikies}
                     onUpdate={this.onChildUpdate.bind(this)} /></div></div>
            <div className='row'>
               <div className='col l12 s12'>
                  <LinksCollection
                     ref={e => this.r.push(e)}
                     key={'links'}
                     value={this.query.links}
                     onUpdate={this.onChildUpdate.bind(this)} /></div></div>
            <div className='row'>
               <TextField
                  ref={e => this.r.push(e)}
                  key='authorName'
                  name='author_name'
                  title='Автор'
                  placeholder='Введи имя автора(ов)'
                  author_name={this.query.author_name}
                  wrapperClassName='input-field col xl6 l6 m4 s12'
                  onUpdate={this.onChildUpdate.bind(this)} />
               <TextField
                  ref={e => this.r.push(e)}
                  key='date'
                  name='date'
                  title='Пора'
                  placeholder='Введи пору написания'
                  date={this.query.date}
                  wrapperClassName='input-field col xl3 l3 m4 s12'
                  onUpdate={this.onChildUpdate.bind(this)} />
               <TextField
                  ref={e => this.r.push(e)}
                  key='council'
                  name='council'
                  title='Собор'
                  placeholder='Введи сокращение собора'
                  council={this.query.council}
                  wrapperClassName='input-field col xl3 l3 m4 s12'
                  onUpdate={this.onChildUpdate.bind(this)} /></div></div>)}}
