import { Component } from 'react'
import PropTypes from 'prop-types'

export default class MemoRow extends Component {
   static defaultProps = {
      locales: [],
      year_date: null,
      add_date: null,
      calendary: null,
      event: null,
      event_date: null,
      bind_kind: null,
      bond_to: null,
      onEdit: null,
      onRemove: null
   }

   static propTypes = {
      locales: PropTypes.array.isRequired,
      year_date: PropTypes.string,
      add_date: PropTypes.string,
      calendary: PropTypes.string.isRequired,
      event: PropTypes.string.isRequired,
      event_date: PropTypes.string,
      bind_kind: PropTypes.string,
      bond_to: PropTypes.string,
      onEdit: PropTypes.func.isRequired,
      onRemove: PropTypes.func.isRequired,
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

   render() {
      return (
         <tr>
            <td>{this.props.memo_orders[0].order}</td>
            <td>{this.props.memory}</td>
            <td>{this.props.year_date}</td>
            <td>{this.props.event}</td>
            <td>{this.props.bond_to}</td>
            <td>{this.props.add_date}</td>
            <td>{this.props.calendary}</td>
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
                  <span>Точно ли удалить помин "{this.props.text}"?</span>
                  <button
                     className="btn-flat toast-action"
                     onClick={this.remove.bind(this)}>
                     Да</button></div>
                  </td></tr>)}}
