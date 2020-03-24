import PropTypes from 'prop-types'

import ShortNamesAsDescriptionsCollection from 'ShortNamesAsDescriptionsCollection'
import NamesAsDescriptionsCollection from 'NamesAsDescriptionsCollection'
import DescriptionsCollection from 'DescriptionsCollection'
import SlugField from 'SlugField'
import CommonForm from 'CommonForm'
import ErrorSpan from 'ErrorSpan'

export default class OrderForm extends CommonForm {
   static defaultProps = {
      slug: {text: ''},
      tweets: [],
      notes: [],
      descriptions: [],

      remoteName: 'order',
      remoteNames: 'orders',
   }

   static propTypes = {
      slug: PropTypes.object,
   }

   static getCleanState() {
      return {
         id: undefined,
         slug: { text: '' },
         descriptions: [],
         tweets: [],
         notes: [],
         events: [],
      }
   }

   renderContent() {
      return [
         <SlugField
            key='slug'
            value={this.state.query.slug.text}
            wrapperClassName='input-field col xl2 l2 m6 s12' />,
         <NamesAsDescriptionsCollection
            key='notes'
            name='notes'
            value={this.state.query.notes} />,
         <ShortNamesAsDescriptionsCollection
            key='tweets'
            name='tweets'
            value={this.state.query.tweets} />,
         <DescriptionsCollection
            key='descriptions'
            name='descriptions'
            value={this.state.query.descriptions} />,
         <ErrorSpan
            error={this.getErrorText(this.state)} />]
   }
}
