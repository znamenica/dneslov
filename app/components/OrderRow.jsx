import { Component } from 'react'
import PropTypes from 'prop-types'

function makeTweet(props) {
   let tweets = props.locales.map((locale) => {
      return props.tweets.reduce((res, tweet) => {
         return res || locale === tweet.language_code && tweet.text }, null)
   }).filter((e) => { return e })

   if (tweets[0] && tweets[0].length > 27) {
      return tweets[0].slice(0, 27) + '...'
   } else {
      return tweets[0] || ''
   }
}

function makeNote(props) {
   let notes = props.locales.map((locale) => {
      return props.notes.reduce((res, note) => {
         return res || locale === note.language_code && note.text }, null)
   }).filter((e) => { return e })

   if (notes[0] && notes[0].length > 27) {
      return notes[0].slice(0, 27) + '...'
   } else {
      return notes[0] || ''
   }
}

function makeDescription(props) {
   let descriptions = props.locales.map((locale) => {
      return props.descriptions.reduce((res, description) => {
         return res || locale === description.language_code && description.text }, null)
   }).filter((e) => { return e })

   if (descriptions[0] && descriptions[0].length > 27) {
      return descriptions[0].slice(0, 27) + '...'
   } else {
      return descriptions[0] || ''
   }
}

export default class OrderRow extends Component {
   static defaultProps = {
      id: null,
      slug: null,
      notes: [],
      tweets: [],
      descriptions: [],
      onEdit: null,
      onRemove: null
   }

   static propTypes = {
      locales: PropTypes.array.isRequired,
      id: PropTypes.number.isRequired,
      slug: PropTypes.object.isRequired,
      tweets: PropTypes.array.isRequired,
      notes: PropTypes.array,
      descriptions: PropTypes.array,
      onEdit: PropTypes.func.isRequired,
      onRemove: PropTypes.func.isRequired,
   }

   // system
   state = { prevProps: {} }

   static getDerivedStateFromProps(props, state) {
      if (props != state.prevProps) {
         return {
            prevProps: props,
            tweet: makeTweet(props),
            note: makeNote(props),
            description: makeDescription(props),
         }
      } else {
         return null
      }
   }

   // custom
   edit() {
      this.props.onEdit(this.props.id)
   }

   remove() {
      let toast = document.querySelector('.toast-wrapper.id' + this.props.id).parentElement

      this.toast.dismiss()
      toast.remove()
      this.props.onRemove(this.props.id)
   }

   removeQuery() {
      let toast = {
         displayLength: 10000,
         classes: 'rounded',
         html: this.$toast.innerHTML,
      }

      this.toast = M.toast(toast)

      document.querySelector('.toast.rounded > .toast-action')
              .addEventListener('click', this.remove.bind(this))
   }

   render() {
      return (
         <tr>
            <td>{this.props.slug.text}</td>
            <td>{this.state.tweet}</td>
            <td>{this.state.note}</td>
            <td>{this.state.description}</td>
            <td className='actions'>
               <i
                  className='small material-icons'
                  onClick={this.edit.bind(this)}>
                  edit</i>
               <i
                  className='small material-icons'
                  onClick={this.removeQuery.bind(this)}>
                  delete</i>
               <div
                  className={'toast-wrapper id' + this.props.id}
                  key='toast'
                  ref={e => this.$toast = e} >
                  <span>Точно ли удалить чин "{this.state.note}"?</span>
                  <button
                     className="btn-flat toast-action"
                     onClick={this.remove.bind(this)}>
                     Да</button></div>
                  </td></tr>)}}
