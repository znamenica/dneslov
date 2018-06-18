import { Component } from 'react'
import PropTypes from 'prop-types'

const event_types = ['Resurrection', 'Repose', 'Writing', 'Appearance', 'Translation', 'Sanctification']

export default class MemoryRow extends Component {
   static defaultProps = {
      locales: [],
      id: null,
      slug: null,
      short_name: null,
      quantity: null,
      covers_to_id: null,
      covers_to: null,
      bond_to_id: null,
      bond_to: null,
      order: null,
      council: '',
      memory_names: [],
      events: [],
      memos: [],
      wikies: [],
      beings: [],
      paterics: [],
      descriptions: [],
      onEdit: null,
      onRemove: null
   }

   static propTypes = {
      locales: PropTypes.array.isRequired,
      id: PropTypes.number.isRequired,
      slug: PropTypes.object.isRequired,
      short_name: PropTypes.string.isRequired,
      quantity: PropTypes.string,
      covers_to: PropTypes.string,
      covers_to_id: PropTypes.number,
      bond_to: PropTypes.string,
      bond_to_id: PropTypes.number,
      order: PropTypes.string.isRequired,
      council: PropTypes.string,
      memory_names: PropTypes.array.isRequired,
      events: PropTypes.array.isRequired,
      memos: PropTypes.array,
      wikies: PropTypes.array,
      beings: PropTypes.array,
      paterics: PropTypes.array,
      descriptions: PropTypes.array,
      onEdit: PropTypes.func.isRequired,
      onRemove: PropTypes.func.isRequired,
   }

   componentWillMount() {
      this.date = this.makeDate()
      this.description = this.makeDescription()
      this.council = this.makeCouncil()
   }

   componentWillReceiveProps(nextProps) {
      if (this.props.events != nextProps.events) {
         this.date = this.makeDate()
      }

      if (this.props.descriptions != nextProps.descriptions) {
         this.description = this.makeDescription()
      }

      if (this.props.council != nextProps.council) {
         this.council = this.makeCouncil()
      }
   }

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

   makeDate() {
      let dates = [...event_types].map((event_type) => {
         return this.props.events.reduce((res, event) => { return event.type == event_type && event.happened_at || res }, null)
      }).filter((e) => { return e })

      return dates[0] || ''
   }

   makeCouncil() {
      if (this.props.council && this.props.council.length > 17) {
         return this.props.council.slice(0, 17) + '...'
      } else {
         return this.props.council || ''
      }
   }

   makeDescription() {
      let descriptions = this.props.locales.map((locale) => {
         return this.props.descriptions.reduce((res, description) => {
            return res || locale === description.language_code && description.text }, null)
      }).filter((e) => { return e })

      if (descriptions[0] && descriptions[0].length > 27) {
         return descriptions[0].slice(0, 27) + '...'
      } else {
         return descriptions[0] || ''
      }
   }

   render() {
      return (
         <tr>
            <td>{this.props.short_name}</td>
            <td>{this.props.order}</td>
            <td>{this.council}</td>
            <td>{this.props.quantity}</td>
            <td>{this.date}</td>
            <td>{this.description}</td>
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
                  <span>Точно ли удалить память "{this.props.short_name}"?</span>
                  <button
                     className="btn-flat toast-action"
                     onClick={this.remove.bind(this)}>
                     Да</button></div>
                  </td></tr>)}}
