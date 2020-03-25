import { Component } from 'react'
import ReactDOM from 'react-dom'
import ReactMarkdown from 'react-markdown'
import PropTypes from 'prop-types'
import M from 'materialize-css'

import Chip from 'Chip'

export default class Description extends Component {
   static defaultProps = {
      descriptions: [],
      selected_calendaries: [],
   }

   state = this.getDefaultState()

   // system
   componentDidMount() {
      this.collapsible = M.Collapsible.init(this.$collapsible, {onOpen: this.onOpen.bind(this)})
   }

   componentWillUnmount() {
      this.collapsible.destroy()
   }

   //private
   getDefaultState(props = this.props) {
      return {
         descriptions: props.descriptions,
         selected_calendaries: props.selected_calendaries,
         default_calendary: this.calculateDefaultCalendary(props),
      }
   }

   calculateDefaultCalendary(props = this.props) {
      return props.selected_calendaries.reduce((cal, calendary_slug) => {
         if (!cal) {
            cal = props.descriptions.reduce((cal, description) => {
               if (!cal && description.calendary && description.calendary.slug == calendary_slug) {
                  cal = calendary_slug
               }

               return cal
            }, null)
         }

         return cal
      }, null)
   }

   // events
   onOpen(e) {
      e[0].scrollIntoView({ behavior: "instant" })
   }

   // state
   isPresent() {
      return this.state.descriptions.length > 0
   }

   activeClassFor(description) {
      if (description.calendary) {
         if (description.calendary.slug == this.state.default_calendary) {
            return "active"
         }
      } else {
         if (!this.state.default_calendary) {
            return "active"
         }
      }

      return ""
   }

   render() {
      console.log("[render] > state", this.state)

      return (
         <div className='col s12'>
            {this.isPresent() &&
               <ul
                  key='description-list'
                  ref={e => this.$collapsible = e}
                  className='collapsible collection popout'>
                  {this.state.descriptions.map((description) =>
                     <li
                        className={"collection-item description " + this.activeClassFor(description)}>
                        <div
                           className={"collapsible-header " + this.activeClassFor(description)}>
                           {description.calendary &&
                              <Chip
                                 key={description.calendary.slug + '-description-slug'}
                                 data={{slug: description.calendary.slug}}
                                 className='calendary'
                                 text={description.calendary.name}
                                 color={description.calendary.color}
                                 url={description.calendary.url} />
                           }
                           {!description.calendary &&
                              <Chip
                                 key='memory-description'
                                 className='calendary'
                                 text='Общее описание' />
                           }
                        </div>
                        <div className="collapsible-body description">
                           <ReactMarkdown source={description.text} /></div></li>)}</ul>}</div>)}}
