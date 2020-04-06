import { Component } from 'react'
import PropTypes from 'prop-types'

export default class HiddenField extends Component {
   static defaultProps = {
      name: 'id',
      value: null,
   }

   static propTypes = {
      name: PropTypes.string.isRequired,
   }

   render() {
      return (
         <div
            className="input-field hidden">
               <input
                  type='hidden'
                  key={this.props.name}
                  id={this.props.name}
                  name={this.props.name}
                  value={this.props.value || ''} />}</div>)
   }
}
