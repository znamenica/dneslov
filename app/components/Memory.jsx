import { Component } from 'react'
import { mixin } from 'lodash-decorators'
import PropTypes from 'prop-types'

import Carousel from 'Carousel'
import EventSpans from 'EventSpans'
import Chip from 'Chip'
import Name from 'Name'
import Description from 'Description'
import GetSlugColor from 'mixins/GetSlugColor'
import Markdown from 'Markdown'
import MetaTags from 'react-meta-tags'
import { getUrlsFrom } from 'support'

@mixin(GetSlugColor)
export default class Memory extends Component {
   static defaultProps = {
      slug: null,
      short_name: null,
      names: [],
      links: [],
      events: [],
      scripta: [],
      coverings: [],
      selectedCalendaries: [],
      defaultCalendarySlug: null,
      specifiedCalendarySlug: null,
      calendarStyle: 'julian'
   }

   static descriptionKindCodes = [ "Appearance", "Writing", "Repose", "Veneration", "Miracle", "Writing", "Resurrection", "Monasticry", "Council", "Marriage" ]
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
            coverings: props.coverings,
            describedMemoIds: Memory.getDescribedMemoIds(describedMemoes),
            links: Memory.getLinks(props),
            iconLinks: Memory.getIconLinks(props),
            scripta: Memory.selectScripta(props),
            happenedAt: Memory.getHappenedAt(props)
         }
      }

      return null
   }

   static calculateDefaultCalendarySlug(props) {
      return props.selectedCalendaries &&
         props.selectedCalendaries.reduce((cal, calendarySlug) => {
            if (!cal) {
               cal = props.titles.reduce((cal, title) => {
                  if (!cal && title.calendary == calendarySlug) {
                     cal = calendarySlug
                  }

                  return cal
               }, null)
            }

            return cal
         }, props.defaultCalendarySlug) || props.defaultCalendarySlug
   }

   static collectKlugs(props) {
      return props.events.map((e) => {
         return e.memoes.map((m) => {
            return Object.keys(m.orders)
         })
      }).flat().concat([ props.slug ]).compact().uniq()
   }

   static selectScripta(props) {
      return props.scripta.filter(c => { return c.text })
   }

   static getMsDate(props) {
      return props.date && (new Date(Date.parse(props.date.split(".").reverse().join("-")))).getTime()
   }

   static selectNameByStateCode(names, stateCode) {
      return names.selectByKey("state_code", stateCode)[0]
   }

   static getCalendaryTitle(props, cslug) {
      let title = props.events.reduce((tt, e) => {
         return e.memoes.reduce((t, m) => { return t || cslug == m.calendary_slug && m.title || null }, tt)
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

   static getOrder(props) {
      return props.events.reduce((order, e) => {
         return e.orders.reduce((_order, o) => {
            return _order || o.name
         }, order)
      }, null) || props.order
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
   ScriptumTable = {
      'Irmos': 'Ирмос',
      'Ikos': 'Икос',
      'Troparion': 'Тропарь',
      'Kontakion': 'Кондак',
      'Stichira': 'Стихира',
      'CryStichira': 'Воззвашна',
      'Exapostilarion': 'Светилен',
      'SessionalHymn': 'Седальна',
      'Kanonion': 'Седальна канона',
      'Kathismion': 'Седальна кафизмы',
      'Polileosion': 'Седальна полиелея',
      'Apostichus': 'Стиховна',
      'Stichiron': 'Литийна',
      'Praision': 'Хвалитна',
      'Sedation': 'Степенна',
      'Anatolion': 'Восточна',
      'Resurrexion': 'Воскресна',
      'Ipakoi': 'Ипакой', // на 17-й кафизмѣ
      'Magnification': 'Величание',
      'Prayer': 'Молитва',
      'Orison': 'Моление',
      'Canticle': 'Спевна',
      'Chant': 'Песнопение',
      'Canto': 'Песма',
      'Bible': 'Библия',
      'Prolog': 'Пролог',
      'Scriptum': 'Текст',
   }

   getScriptumTitle(scriptum) {
      return [
         [
            this.ScriptumTable[scriptum.type],
            scriptum.title && "«" + scriptum.title + "»",
         ].compact().join(" "),
         scriptum.prosomeion_title && "подобен «" + scriptum.prosomeion_title + "»",
         scriptum.tone && "глас " + scriptum.tone + "-й",
      ].compact().join(", ")
   }

   sortedScripta() {
      let keys = Object.keys(this.ScriptumTable)

      return this.state.scripta.sort((a, b) => {
         return keys.indexOf(a.type) - keys.indexOf(b.type)
      })
   }

   getDescription() {
      return this.state.order + " " +
             this.props.names.reduce((res, x) => { return res + " " + x.name_text }, "") +
             this.state.describedMemoes.reduce((res, x) => { return res + " " + x.description }, "")
   }

   render() {
      console.log("[render] *", { 'this.props': this.props, 'this.state': this.state })

      return (
         <div className='row'>
            <MetaTags>
               <meta id="meta-description" name="description" content={this.getDescription()} />
            </MetaTags>
            <div className='col s12'>
               <div className='row'>
                  <div className='col s12'>
                     {this.state.order &&
                        <Chip
                           color={this.getSlugColor(this.state.order)}
                           text={this.state.order} />}
                     <Name
                        short_name={this.props.short_name}
                        defaultNameInCalendary={this.state.title}
                        klugs={this.state.klugs}
                        names={this.props.names} />
                     {this.state.happenedAt && <Chip
                        className='happened-at'
                        text={this.state.happenedAt} />}</div></div></div>
            {this.state.iconLinks.isPresent() &&
               <Carousel
                  images={this.state.iconLinks} />}
            {this.props.bond_memories.length > 0 &&
               <div className='col s12'>
                  <div className='row'>
                     <div className='col s12 title'>
                        Опорная память</div>
                     <div className='col s12'>
                        {this.props.bond_memories.filterMap((bm) =>
                           <Chip
                              color={this.getSlugColor(bm.kind)}
                              url={getUrlsFrom(this.props.specifiedCalendarySlug, bm.slug)[0]}
                              text={bm.name} />)}</div></div></div>}
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
                              key={'link-'+link.id}
                              url={link.url}
                              color={Memory.getColorForLink(link)}
                              text={Memory.getLinkText(link)} />)}</div></div></div>}
            {this.state.coverings.isPresent() &&
               <div className='col s12'>
                  <div className='row'>
                     <div className='col s12 title'>
                        Покровитель:</div>
                     <div className='col s12'>
                        {this.state.coverings.map((c) =>
                           <Chip
                              key={'covering-' + c.id}
                              color={Memory.getColorForLink(c.name)}
                              text={c.name} />)}</div></div></div>}
            {this.state.scripta.isPresent() &&
               <div className='col s12'>
                  {this.sortedScripta().map((scriptum) =>
                     <div className='row'>
                        <div className='col s12 title'>
                           {this.getScriptumTitle(scriptum)}</div>
                        <div className='col s12 scriptum'>
                           <Markdown source={scriptum.text} /></div></div>)}</div>}
            {this.props.events.isPresent() &&
               <div className='col s12'>
                  <div className='row'>
                     <div className='col s12 title'>
                        События</div>
                     <div className='col s12'>
                        <EventSpans
                           msDate={this.state.msDate}
                           slug={this.props.slug}
                           calendarStyle={this.props.calendarStyle}
                           describedMemoIds={this.state.describedMemoIds}
                           defaultCalendarySlug={this.state.defaultCalendarySlug}
                           specifiedCalendarySlug={this.props.specifiedCalendarySlug}
                           events={this.props.events} /></div></div></div>}</div>)}}
