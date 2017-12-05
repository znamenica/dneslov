import { Component } from 'react'
import PropTypes from 'prop-types'

export default class NameRow extends Component {
   static defaultProps = {
      locales: [],
      text: null,
      language_code: null,
      alphabeth_code: null,
      root_id: null,
      root: null,
      bind_kind: null,
      bond_to_id: null,
      bond_to: null,
      onEdit: null,
      onRemove: null
   }

   static propTypes = {
      locales: PropTypes.array.isRequired,
      text: PropTypes.string.isRequired,
      language_code: PropTypes.string.isRequired,
      alphabeth_code: PropTypes.string.isRequired,
      root_id: PropTypes.integer.isRequired,
      root: PropTypes.string.isRequired,
      bind_kind: PropTypes.string,
      bond_to_id: PropTypes.integer,
      bond_to: PropTypes.string,
      onEdit: PropTypes.func.isRequired,
      onRemove: PropTypes.func.isRequired,
   }

   edit() {
      this.props.onEdit(this.props.id)
   }

   remove() {
      let toast = document.querySelector('.toast-wrapper.' + this.props.id).parentElement

      toast.remove()
      this.props.onRemove(this.props.id)
   }

   removeQuery() {
      Materialize.toast(this.$toast, 15000, 'rounded')
   }

   render() {
      return (
         <tr>
            <td>{this.props.text}</td>
            <td>{this.props.language_code}</td>
            <td>{this.props.alphabeth_code}</td>
            <td>{this.props.bond_to}</td>
            <td>{this.props.root}</td>
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
                  className={'toast-wrapper ' + this.props.id}
                  key='toast'
                  ref={e => this.$toast = e} >
                  <span>Точно ли удалить имя "{this.props.text}"?</span>
                  <button
                     className="btn-flat toast-action"
                     onClick={this.remove.bind(this)}>
                     Да</button></div>
                  </td></tr>)}}
