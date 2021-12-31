import { Component } from 'react'
import PropTypes from 'prop-types'

import ReactMarkdown, { GlobalConfiguration } from 'react-showdown'

export default class Markdown extends Component {
   static defaultProps = {
      source: "",
   }

   static propTypes = {
      source: PropTypes.string.isRequired,
   }

   static getDerivedStateFromProps(props, state) {
      if (props !== state.prevProps) {
         return {
            extensions: Markdown.createExtensions()
         }
      }

      return null
   }

   static createExtensions() {
      GlobalConfiguration.setExtension('InterLink', {
         type: 'output',
         regex: /\[\[([^\|]*)\|([^\]]*)\]\]/g,
         replace: function (_tag, slug, text) {
            let url = new URL(window.location.href)
            return '<a target="_blank" href="/' + slug + url.search + '">' + text + '</a>'
         }
      })
   }

   state = {}

   // system
   render() {
      console.debug("[render] ** this.props", this.props)

      return (
         <ReactMarkdown 
            markdown={this.props.source}
            options={{ tables: true, emoji: true, extensions: ['InterLink'] }} />)
   }
}
