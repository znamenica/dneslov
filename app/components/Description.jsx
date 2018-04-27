import { Component } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'

import Chip from 'Chip'

export default class Description extends Component {
   static defaultProps = {
      descriptions: [],
      selected_calendaries: [],
   }

   state = this.getDefaultState()

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

   // system
   componentWillMount() {
      this.componentWillTouch()
   }

   componentWillReceiveProps(nextProps) {
      if (this.props != nextProps) {
         this.setState(this.getDefaultState(nextProps))
      }
   }

   componentWillMount() {
      this.componentWillTouch()
   }

   componentDidMount() {
      $(this.$collapsible).collapsible({onOpen: this.onOpen.bind(this)})

      this.$slugs.forEach((slug) => {
         slug.addEventListener('click', this.onSlugClick.bind(this))
      })

      this.mounting = false
   }

   componentWillUnmount() {
      this.$slugs.forEach((slug) => {
         slug.removeEventListener('click', this.onSlugClick.bind(this))
      })
   }

   componentWillTouch() {
      this.calculateDefaultCalendary()
      this.$headers = new Array
      this.$slugs = new Array
      this.mounting = true
   }

   // events
   onSlugClick(e) {
      e.stopPropagation()
   }

   onOpen(e) {
      if (!this.mounting) {
         e[0].scrollIntoView({ behavior: "instant" })
      }
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
      console.log("DESCRIPTION", this.state)

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
                           key={description.calendary && description.calendary.slug + '-description-header' || 'common-description-header'}
                           ref={e => this.$headers.push(e)}
                           className={"collapsible-header " + this.activeClassFor(description)}>
                           {description.calendary &&
                              <Chip
                                 key={description.calendary.slug + '-description-slug'}
                                 ref={e => this.$slugs.push(ReactDOM.findDOMNode(e))}
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
                        <div className="collapsible-body">
                            {description.text}</div></li>)}</ul>}</div>)}}
