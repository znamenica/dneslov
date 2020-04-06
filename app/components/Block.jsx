import { Component } from 'react'
import PropTypes from 'prop-types'

import { renderElement } from 'render'

export default class Block extends Component {
   static defaultProps = {
      name: null,
      value: {},
      meta: {},
      validations: {},
      wrapperClassName: null,
   }

   static propTypes = {
      name: PropTypes.string.isRequired,
      value: PropTypes.object.isRequired,
      meta: PropTypes.object.isRequired,
      validations: PropTypes.object.isRequired,
      validation_context: PropTypes.object.isRequired,
      wrapperClassName: PropTypes.string.isRequired,
   }

   render() {
      console.log("[render] > props:", this.props)

      return renderElement(this.props, this.props.meta)
   }
}
