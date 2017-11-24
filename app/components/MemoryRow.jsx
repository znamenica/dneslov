import { Component } from 'react'
import PropTypes from 'prop-types'

const event_types = ['Resurrection', 'Repose', 'Writing', 'Appearance', 'Translation', 'Sanctification']

export default class MemoryRow extends Component {
   static defaultProps = {
      locales: [],
      slug: null,
      short_name: null,
      view_string: null,
      quantity: null,
      covers_to_id: null,
      sight_id: null,
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
      slug: PropTypes.string.isRequired,
      short_name: PropTypes.string.isRequired,
      view_string: PropTypes.string,
      quantity: PropTypes.integer,
      covers_to_id: PropTypes.string,
      sight_id: PropTypes.string,
      order: PropTypes.object.isRequired,
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
   }

   componentWillReceiveProps(nextProps) {
      if (this.props.events != nextProps.events) {
         this.date = this.makeDate()
      }

      if (this.props.descriptions != nextProps.descriptions) {
         this.description = this.makeDescription()
      }
   }

   edit() {
      this.props.onEdit(this.props.slug)
   }

   remove() {
      let toast = document.querySelector('.toast-wrapper.' + this.props.slug).parentElement

      toast.remove()
      this.props.onRemove(this.props.slug)
   }

   removeQuery() {
      Materialize.toast(this.$toast, 15000, 'rounded')
   }

   makeDate() {
      let dates = [...event_types].map((event_type) => {
         return this.props.events.reduce((res, event) => { return event.type == event_type && event.happened_at || res }, null)
      }).filter((e) => { return e })

      return dates[0] || ''
   }

   makeDescription() {
      let descriptions = this.props.locales.map((locale) => {
         return this.props.descriptions.reduce((res, description) => {
            return res || locale === description.language_code && description.text }, null)
      }).filter((e) => { return e })

      return descriptions[0] || ''
   }

   render() {
      return (
         <tr>
            <td>{this.props.short_name}</td>
            <td>{this.props.order}</td>
            <td>{this.props.council}</td>
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
                  className={'toast-wrapper ' + this.props.slug}
                  key='toast'
                  ref={e => this.$toast = e} >
                  <span>Точно ли удалить память "{this.props.short_name}"?</span>
                  <button
                     className="btn-flat toast-action"
                     onClick={this.remove.bind(this)}>
                     Да</button></div>
                  </td></tr>)}}
