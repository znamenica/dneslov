import { Component } from 'react'
import { mixin } from 'lodash-decorators'
import PropTypes from 'prop-types'

import Carousel from 'Carousel'
import EventSpans from 'EventSpans'
import Chip from 'Chip'
import Name from 'Name'
import Description from 'Description'
import GetSlugColor from 'mixins/GetSlugColor'

@mixin(GetSlugColor)
export default class Memory extends Component {
   static defaultProps = {
      slug: null,
      short_name: null,
      names: [],
      links: [],
      events: [],
      cantoes: [],
      selected_calendaries: [],
      default_calendary_slug: null
   }

   static descriptionKindCodes = [ "Appearance", "Writing", "Repose", "Veneration" ]
   static happenedAtKindCodes = [ "Miracle", "Appearance", "Writing", "Veneration", "Repose", "Resurrection" ]

   static getDerivedStateFromProps(props, state) {
      if (props !== state.prevProps) {
         let cal = Memory.calculateDefaultCalendarySlug(props),
             order = Memory.getOrder(props),
             describedMemoes = Memory.getDescribedMemoes(props)

         return {
            prevProps: props,
            defaultCalendarySlug: cal,
            order: order,
            title: Memory.getCalendaryTitle(props, cal),
            msDate: Memory.getMsDate(props),
            klugs: Memory.collectKlugs(props),
            describedMemoes: describedMemoes,
            describedMemoIds: Memory.getDescribedMemoIds(describedMemoes),
            links: Memory.getLinks(props),
            iconLinks: Memory.getIconLinks(props),
            cantoes: Memory.selectCantoes(props),
            happenedAt: Memory.getHappenedAt(props)
         }
      }

      return null
   }

   static calculateDefaultCalendarySlug(props) {
      return props.selected_calendaries &&
         props.selected_calendaries.reduce((cal, calendarySlug) => {
            if (!cal) {
               cal = props.titles.reduce((cal, title) => {
                  if (!cal && title.calendary == calendarySlug) {
                     cal = calendarySlug
                  }

                  return cal
               }, null)
            }

            return cal
         }, props.default_calendary_slug) || props.default_calendary_slug
   }

   static collectKlugs(props) {
      return props.events.map((e) => {
         return e.memoes.map((m) => {
            return Object.keys(m.orders)
         })
      }).flat().concat([ props.slug ]).compact().uniq()
   }

   static selectCantoes(props) {
      return props.cantoes.filter(c => { return c.text })
   }

   static getMsDate(props) {
      return props.date && (new Date(Date.parse(props.date.split(".").reverse().join("-")))).getTime()
   }

   static selectNameByStateCode(names, stateCode) {
      return names.selectByKey("state_code", stateCode)[0]
   }

   static getCalendaryTitle(props, cslug) {
      let title = props.events.reduce((tt, e) => {
         return e.memoes.reduce((t, m) => { return t || cslug == m.calendary_slug && m.title }, tt)
      }, null)

      return title || props.short_name
   }

   static getDescribedMemoes(props) {
      let describedMemoes = props.events.filter((x) => {
         return this.descriptionKindCodes.indexOf(x.kind_code) >= 0
      }).sortByArray(this.descriptionKindCodes, "kind_code").map((e) => {
         return e.memoes
      }).flat().compact().reduce((res, memo) => {
         if (memo.description) {
            res[memo.calendary_slug] ||= memo
         }
         return res
      }, {})

      return Object.values(describedMemoes).compact()
   }

   static getDescribedMemoIds(describedMemoes) {
      return describedMemoes.map((m) => { return m.id })
   }

   static getLinks(props) {
      let links = [ "WikiLink", "BeingLink", "PatericLink" ].map((type) => {
         return props.links.selectByKey("type", type)
      }).flat()

      return links
   }

   static getIconLinks(props) {
      return props.links.selectByKey("type", "IconLink")
   }

   static getColorForLink(link) {
      let map = {
         "WikiLink": "ddf",
         "BeingLink": "dfd",
         "PatericLink": "fdd"
      }

      return map[link.type]
   }

   static getLinkText(link) {
      if (link.text) {
         return link.text
      }

      let re = new RegExp('https?://([^/]+)')
      let match = link.url.match(re)
      return match[1]
   }

   static isInCalendaries(props, memo) {
      let selected = props.selected_calendaries.filter(calendarySlug => {
         return memo.calendary_slug == calendarySlug
      })

      return selected.length > 0
   }

   static getOrder(props) {
      return props.events.reduce((order, e) => {
         return order || e.memoes.reduce((_order, m) => {
            return _order || this.isInCalendaries(props, m) && Object.values(m.orders)[0]
         }, order)
      }, null)
   }

   static getHappenedAt(props) {
      return props.events.filter((x) => {
         return this.happenedAtKindCodes.indexOf(x.kind_code) >= 0
      }).sortByArray(this.happenedAtKindCodes, "kind_code").flat().reduce((happenedAt, e) => {
         return happenedAt || e.happened_at
      }, null)
   }

   // system
   state = {}

   // custom
   getCantoTitle(canto) {
      return [
         [
            canto.type == "Troparion" && "Тропарь" || "Кондак",
            canto.title && "«" + canto.title + "»",
         ].compact().join(" "),
         canto.prosomeion_title && "подобен «" + canto.prosomeion_title + "»",
         canto.tone && "глас " + canto.tone + "-й",
      ].compact().join(", ")
   }

   render() {
      console.log("[render] *", { 'this.props': this.props, 'this.state': this.state })

      return (
         <div className='row'>
            <div className='col s12'>
               <div className='row'>
                  <div className='col s12'>
                     <Chip
                        color={this.getSlugColor(this.state.order)}
                        text={this.state.order} />
                     <Name
                        short_name={this.state.short_name}
                        defaultNameInCalendary={this.state.title}
                        klugs={this.state.klugs}
                        names={this.props.names} />
                     {this.state.happenedAt && <Chip
                        className='happened-at'
                        text={this.state.happenedAt} />}</div></div></div>
            {this.state.iconLinks.isPresent() &&
               <Carousel
                  images={this.state.iconLinks} />}
            {this.state.describedMemoes.isPresent() &&
               <Description
                  describedMemoes={this.state.describedMemoes}
                  defaultCalendarySlug={this.state.defaultCalendarySlug} />}
            {this.state.links.isPresent() &&
               <div className='col s12'>
                  <div className='row'>
                     <div className='col s12 title'>
                        Внешние ссылки</div>
                     <div className='col s12'>
                        {this.state.links.map((link) =>
                           <Chip
                              key={link.id}
                              url={link.url}
                              color={Memory.getColorForLink(link)}
                              text={Memory.getLinkText(link)} />)}</div></div></div>}
            {this.state.cantoes.isPresent() &&
               <div className='col s12'>
                  {this.state.cantoes.map((canto) =>
                     <div className='row'>
                        <div className='col s12 title'>
                           {this.getCantoTitle(canto)}</div>
                        <div className='col s12'>
                           {canto.text}</div></div>)}</div>}
            {this.props.events.isPresent() &&
               <div className='col s12'>
                  <div className='row'>
                     <div className='col s12 title'>
                        События</div>
                     <div className='col s12'>
                        <EventSpans
                           msDate={this.state.msDate}
                           describedMemoIds={this.state.describedMemoIds}
                           defaultCalendarySlug={this.state.defaultCalendarySlug}
                           events={this.props.events} /></div></div></div>}</div>)}}
