import { Component } from 'react'
import { mixin } from 'lodash-decorators'
import ReactDOM from 'react-dom'
import ReactMarkdown from 'react-markdown'
import PropTypes from 'prop-types'
import M from 'materialize-css'

import Chip from 'Chip'
import GetSlugColor from 'mixins/GetSlugColor'

@mixin(GetSlugColor)
export default class Description extends Component {
   static defaultProps = {
      describedMemoes: [],
      defaultCalendarySlug: null,
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
      return this.props.describedMemoes.length > 0
   }

   activeClassFor(memo) {
      if (memo.calendary_slug == this.props.defaultCalendarySlug) {
         return "active"
      }

      return ""
   }

   render() {
      console.log("[render] > this.props", this.props)

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
                     {this.props.describedMemoes.map((memo) =>
                        <li
                           className={"collection-item description " + this.activeClassFor(memo)}>
                           <div
                              className={"collapsible-header " + this.activeClassFor(memo)}>
                              <Chip
                                 key={memo.calendary_slug + '-description-slug'}
                                 data={{slug: memo.calendary_slug}}
                                 className='calendary'
                                 text={memo.calendary_title}
                                 color={this.getSlugColor(memo.calendary_slug)}
                                 url={memo.calendary_url} /></div>
                           <div className="collapsible-body">
                              <div className='container'>
                                 <div className='row'>
                                    <div className='col s12 description'>
                                       <ReactMarkdown source={memo.description} /></div></div></div></div></li>)}</ul></div></div></div>)
   }
}
