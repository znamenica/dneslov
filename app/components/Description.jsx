import { Component } from 'react'
import ReactDOM from 'react-dom'
import ReactMarkdown from 'react-markdown'
import PropTypes from 'prop-types'
import M from 'materialize-css'

import Chip from 'Chip'

export default class Description extends Component {
   static defaultProps = {
      descriptions: [],
      calendary_slug: null,
   }

   // system
   componentDidMount() {
      this.collapsible = M.Collapsible.init(this.$collapsible, {onOpen: this.onOpen.bind(this)})
   }

   componentWillUnmount() {
      this.collapsible.destroy()
   }

   // events
   onOpen(e) {
      e[0].scrollIntoView({ behavior: "instant" })
   }

   // props
   isPresent() {
      return this.props.descriptions.length > 0
   }

   activeClassFor(description) {
      if (description.calendary) {
         if (description.calendary.slug == this.props.calendary_slug) {
            return "active"
         }
      } else {
         if (!this.props.calendary_slug) {
            return "active"
         }
      }

      return ""
   }

   render() {
      console.log("[render] > props", this.props)

      return (
         <div className='col s12'>
            <div className='row'>
               <div className='col s12 title'>
                  Описание</div>
               <div className='col s12'>
                  <ul
                     key='description-list'
                     ref={e => this.$collapsible = e}
                     className='collapsible collection popout'>
                     {this.props.descriptions.map((description) =>
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
                           <div className="collapsible-body">
                              <div className='container'>
                                 <div className='row'>
                                    <div className='col s12 description'>
                                       <ReactMarkdown source={description.text} /></div></div></div></div></li>)}</ul></div></div></div>)
   }
}
