import { Component } from 'react'
import PropTypes from 'prop-types'
import { mixin } from 'lodash-decorators'

import ValueToObject from 'mixins/ValueToObject'

@mixin(ValueToObject)
export default class BooleanBox extends Component {
   static defaultProps = {
      name: null,
      title: null,
      wrapperClassName: null,
      onUpdate: null,
   }

   static propTypes = {
      name: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      wrapperClassName: PropTypes.string.isRequired,
      onUpdate: PropTypes.func.isRequired,
   }

//   state = {
//      [this.props.name_key]: this.props[this.props.name_key] || false
//   }

//   componentWillReceiveProps(nextProps) {
//      if (nextProps != this.props) {
//         this.setState({[this.props.name_key]: nextProps[nextProps.name_key] || false})
//      }
//   }

   onCheck(e) {
      let object = this.valueToObject(this.props.name, e.target.checked),
          ce = new CustomEvent('dneslov-update-path', { detail: object })

      document.dispatchEvent(ce)
      //this.setState({[this.props.name_key]: value})
      //this.props.onUpdate({[this.props.name_key]: value})
   }

   render() {
      console.log(this.props)

      return (
         <div
            className={this.props.wrapperClassName}>
            <label>
               <input
                  type='checkbox'
                  onChange={this.onCheck.bind(this)}
                  checked={this.props.value} />
               <span>
                  {this.props.title}</span></label></div>)}}
