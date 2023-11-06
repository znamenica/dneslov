import { Component } from 'react'
import { mixin } from 'lodash-decorators'
import PropTypes from 'prop-types'

import GetSlugColor from 'mixins/GetSlugColor'
import Chip from 'Chip'
import Name from 'Name'

@mixin(GetSlugColor)
export default class Error extends Component {
   static defaultProps = {
      error: {},
   }

   static propTypes = {
      error: PropTypes.object,
   }

   render() {
      return (
         <div
            className={this.props.appendClassName}>
            <Chip
               color={this.getSlugColor(this.props.error.code)}
               text={this.props.error.code} />
            <Name
               defaultNameInCalendary={this.props.error.message} /></div>)
   }
}
