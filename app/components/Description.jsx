import { Component } from 'react'
import { mixin } from 'lodash-decorators'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import M from 'materialize-css'

import Chip from 'Chip'
import Name from 'Name'
import GetSlugColor from 'mixins/GetSlugColor'
import Markdown from 'Markdown'

@mixin(GetSlugColor)
export default class Description extends Component {
   static defaultProps = {
      describedMemoes: [],
      defaultCalendarySlug: null,
      i18: { title: "Описание" }
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

   indexActiveMemo() {
      this.index = this.index || this.props.describedMemoes.indexOf((memo) => {
         return memo.calendary_slug == this.props.defaultCalendarySlug
      })

      console.debug("[indexActiveMemo] >>>", this.index)

      return this.index
   }

   activeClassFor(memo) {
      if (this.indexActiveMemo() >= 0) {
         if (memo.calendary_slug == this.props.defaultCalendarySlug) {
            return "active"
         }
      } else {
         if (memo.calendary_slug == this.props.describedMemoes[0].calendary_slug) {
            return "active"
         }
      }

      return ""
   }

   render() {
      console.log("[render] > this.props", this.props)

      return (
         <div className='col s12'>
            <div className='row'>
               <div className='col s12 title'>
                  {this.props.i18.title}</div>
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
                                 url={memo.calendary_url} />
                              <Name
                                 short_name={memo.title} />
                              <Chip
                                 key={memo.calendary_slug + '-description-year-date'}
                                 className='year-date right'
                                 text={memo.year_date}
                                 color={this.getSlugColor(memo.year_date)}
                                 url={memo.url} /></div>
                           <div className="collapsible-body">
                              {memo.description &&
                                 <div className='container'>
                                    <div className='row'>
                                       <div className='col s12 description'>
                                          <Markdown source={memo.description} /></div></div></div>}</div></li>)}</ul></div></div></div>)
   }
}
