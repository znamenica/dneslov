import { Component } from 'react'
import PropTypes from 'prop-types'
import { mixin } from 'lodash-decorators'
import { Autocomplete } from 'materialize-css'
import * as Axios from 'axios'
import { merge } from 'merge-anything'

import ErrorSpan from 'ErrorSpan'
import Chip from 'Chip'
import Validation from 'Validation'
import ValueToObject from 'mixins/ValueToObject'
import RepathTo from 'mixins/RepathTo'

@mixin(Validation)
@mixin(ValueToObject)
@mixin(RepathTo)
export default class DynamicField extends Component {
   static defaultProps = {
      pathname: null,
      key_name: null,
      value_name: null,
      name: 'text_id',
      humanized_name: 'text',
      value: "",
      begin: null,
      end: null,
      selectable: false,
      humanized_value: undefined,
      wrapperClassName: null,
      title: null,
      placeholder: null,
      validations: {},
   }

   static propTypes = {
      pathname: PropTypes.string.isRequired,
      key_name: PropTypes.string.isRequired,
      value_name: PropTypes.string.isRequired,
      humanized_name: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      begin: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      end: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      selectable: PropTypes.bool.isRequired,
      wrapperClassName: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      placeholder: PropTypes.string.isRequired,
      validations: PropTypes.object.isRequired,
   }

   data = {list: {}, total: 0}
   state = {start: this.props.begin, end: this.props.end}

   // system
   constructor(props) {
      super(props)

      if (props.value) {
         this.data = { list: { [props.humanized_value]: props.value }, total: 1 }
      }

      this.onKeyDown = this.onKeyDown.bind(this)
      this.onSelectionChange = this.onSelectionChange.bind(this)
      this.onSelectStart = this.onSelectStart.bind(this)
   }

   componentDidMount() {
      console.debug("[componentDidMount] ** ", this.data, this.props.value)
      this.setup()

      document.addEventListener('keydown', this.onKeyDown)
      document.addEventListener('selectionchange', this.onSelectionChange, { passive: true })
      this.$span.addEventListener('selectstart', this.onSelectStart, { passive: true })

//      if (this.isRangeEnabled()) {
//         let range = new Range

///         console.log("wwwwww", this.$span, this.props.begin, this.props.end)
//         range.setStart(this.$span, this.props.begin)
         //range.setEnd(this.$span, this.props.end)

//         if (this.props.begin < this.props.end) {
 //           this.setState({range: range})
//         }
//      }
   }

   componentDidUpdate() {
      console.debug("[componentDidUpdate] <<<")
      if (this.$input) {
         this.setup()
         this.autoUpdate()
      }
   }

   componentWillUnmount() {
      console.debug("[componentWillUnmount] <<<")
      this.destroy()
      this.$span.removeEventListener('selectstart', this.onSelectStart)
      document.removeEventListener('selectionchange', this.onSelectionChange)
      document.removeEventListener('keypress', this.onKeyDown)
   }

   shouldComponentUpdate(nextProps, nextState) {
      return nextState.pendingRange || nextState.selectApplied ||
             this.props.value !== nextProps.value ||
             this.props.humanized_value !== nextProps.humanized_value
   }

   //events
   onChange(e) {
      let humanized_value = e.target.value

      console.log("[onChange] * update to", humanized_value)
      this.updateTo(humanized_value, false)

      console.debug("[onChange] ** analyzing:", this.triggered,
         humanized_value, this.data, this.data && this.data.total,
         this.data && Object.keys(this.data.list).length)

      if (!this.triggered || humanized_value &&
          (!humanized_value.includes(this.triggered) &&
           !this.triggered.includes(humanized_value) ||
           this.data && (this.data.total > Object.keys(this.data.list).length &&
            humanized_value.includes(this.triggered) ||
            this.triggered.includes(humanized_value)))) {
         this.getDataFor(humanized_value)
      }
   }

   onSelectFromList(humanized_value, e) {
      console.log("[onSelectFromList] * fix to:", humanized_value)
      this.updateTo(humanized_value)
   }

   onKeyDown(e) {
      if (e.key === "Enter" && e.target == this.$input) {
         console.log("[onKeyDown] * fix to", this.$input.value)
         e.preventDefault()
         if (this.data.list[this.$input.value]) {
            this.updateTo(this.$input.value)
         }
      }
   }

   onChipAct() {
      let object = this.valueToObject(this.props.name, null),
          ce = new CustomEvent('dneslov-update-path', { detail: object })

      console.log("[onChipAct] * unfix with", object)
      document.dispatchEvent(ce)
   }

   onSelectStart() {
      if (this.isRangeEnabled()) {
         this.setState({selectStart: true, selectApplied: false})
      }
   }

   onSelectionChange() {
      if (this.isRangeEnabled() && this.state.selectStart) {
         let selection = document.getSelection(),
             range = selection.getRangeAt(0)

         if (range.collapsed) {
            this.setState({pendingRange: null})
         } else {
            this.setState({pendingRange: range})
         }
      }
   }

   //actions
   setup() {
      if (this.$input) {
         this.input = Autocomplete.init(this.$input, {
            data: {},
            limit: 20,
            minLength: 1,
            onAutocomplete: this.onSelectFromList.bind(this)
         })
      }
   }

   destroy() {
      if (this.input) {
         this.input.destroy()
      }

      this.input = false
   }

   //actions
   autoUpdate() {
      console.log("[autoUpdate] * this.input:", this.input)
      let list = Object.keys(this.data.list).reduce((h, x) => { h[x] = null; return h }, {})

      console.debug("[autoUpdate] ** list:", list)
      this.input.updateData(list)
   }

   updateTo(humanizedValue, autofix = true) {
      console.log("[updateTo] <<< humanizedValue:", humanizedValue, "autofix:", autofix)
      let ce, detail, valueDetail = {}, value

      if (autofix || this.data.total == 1) {
         value = this.data.list[humanizedValue]
      }

      if (value) {
         valueDetail = this.valueToObject(this.props.name, value)
      }

      detail = merge({}, this.valueToObject(this.props.humanized_name, humanizedValue), valueDetail)
      console.debug("[updateTo] ** detail:", detail, "valueDetail:", valueDetail, "huName: ", this.props.humanized_name)

      ce = new CustomEvent('dneslov-update-path', merge({}, { detail: detail }))
      document.dispatchEvent(ce)
   }

   getContext(contextIn) {
      let ctx = contextIn || this.props.context_value || {}

      return Object.entries(ctx).reduce((res, [name, valueIn]) => {
         if (typeof(valueIn) == "function") {
            let value = valueIn()

            if (value) {
               res[name] = value
            }
         } else {
            res[name] = valueIn
         }

         return res
      }, {})
   }

   getDataFor(text) {
      console.debug("[getDataFor] <<<")
      let data = merge(this.getContext(), { t: text })

      if (this.props.value_context) {
         Object.entries(this.getContext(this.props.value_context)).forEach(([key, value]) => {
            data["by_" + key] = value
         })
      }

      this.triggered = text

      var request = {
         data: data,
         url: '/' + this.props.pathname + '.json',
      }

      console.log("[getDataFor] * load send", data, 'to /' + this.props.pathname + '.json')
      Axios.get(request.url, { params: request.data })
        .then(this.onLoadSuccess.bind(this))
        .catch(this.onLoadFailure.bind(this))
   }

   onLoadFailure() {
      console.debug("[onLoadFailure] <<<")
      this.triggered = undefined
   }

   onLoadSuccess(response) {
      console.debug("[onLoadSuccess] <<<")

      var dynamic_data = response.data

      this.storeDynamicData(dynamic_data)

      console.log("[onLoadSuccess] *", dynamic_data, "for: ",  this.triggered, "with response:", response)

      if (this.$input) {
         console.log("[onLoadSuccess] * update autocomplete for", this.props.humanized_value)
         this.autoUpdate()
         this.input.open()
         this.updateTo(this.props.humanized_value, false)
      }
   }

   storeDynamicData(dynamic_data) {
      console.debug("[storeDynamicData] <<<", dynamic_data)
      this.data = {
         total: dynamic_data.total,
         list: dynamic_data.list.reduce((h, x) => {
            h[x[this.props.key_name]] = x[this.props.value_name]
            return h
         }, {}),
      }
      console.log("[storeDynamicData] * after store", this.data)
   }

   getElementIndex(el) {
      return Array.prototype.indexOf.call(el.parentNode.children, el)
   }

   onApplyRange() {
      let r = this.state.pendingRange,
          beginName = this.repathTo(this.props.name, "begin"),
          endName = this.repathTo(this.props.name, "end"),
          valueDetail, ce,
          //indexStart = this.getElementIndex(r.startContainer),
          //indexEnd = r.endContainer.getElementIndex(),
          posEnd = r.endOffset, posStart = r.startOffset, posOffset = 0,
          prev = r.startContainer.parentNode.previousElementSibling?.firstChild,
          next = r.startContainer

      //console.debug("[onApplyRange] wwww ** pendingRange:", r.startContainer.constructor.name, r, "ce:", ce)
      //console.debug("[onApplyRange] wwww ** indexStart:", indexStart, "indexEnd:", indexEnd)
      //console.debug("[onApplyRange] wwww ** posEnd:", posEnd, "posStart:", posStart, "posOffset", posOffset)
      //console.debug("[onApplyRange] wwww ** prev:", prev, "next:", next)

      while (prev) {
         posOffset += prev.length
         //prevSib = prev.parentNode.previousElementSibling
         //console.debug("[onApplyRange] wwww prev:", prev, "l",prev.length, "sib:", prevSib && prevSib.firstChild)

         //prev = prevSib && prevSib.firstChild
         prev = prev.parentNode.previousElementSibling?.firstChild
      }
      posStart += posOffset

      while (next && next != r.endContainer) {
         posOffset += next.length
         //let nextSib = next.parentNode.nextElementSibling
         //console.debug("[onApplyRange] wwww next:", next, "l", next.length, "sib:", nextSib && nextSib.firstChild)

         //next = nextSib && nextSib.firstChild
         next = next.parentNode.nextElementSibling?.firstChild
      }
      posEnd += posOffset

      valueDetail = merge({}, this.valueToObject(beginName, posStart), this.valueToObject(endName, posEnd))
      ce = new CustomEvent('dneslov-update-path', merge({}, { detail: valueDetail }))
      console.debug("[onApplyRange] wwww ** posOffset, ** posStart:", posStart, "posEnd:", posEnd, "ce", ce)

      document.dispatchEvent(ce)
      this.setState({
         pendingRange: null,
         start: posStart,
         end: posEnd,
         selectStart: null,
         selectApplied: true
      })
   }

   className() {
      return [ "input-field",
               this.props.wrapperClassName,
               this.getErrorText(this.props.value) && 'invalid' ].
         filter((x) => { return x }).join(" ")
   }

   spanClassName() {
      return this.isMultiline() && ["multiline"] || []
   }

   getApplierPositionCss() {
      let rect = this.state.pendingRange.getBoundingClientRect(),
          span = document.elementFromPoint(rect.x, rect.y).getBoundingClientRect(),
          top = rect.bottom - span.top + 16, left = rect.right - span.left + 16
      console.debug("[getApplierPositionCss] ** rect:", top, left)

      return {top: `${top}px`, left: `${left}px`, position: "absolute"}
   }

   // conditional
   isRangeEnabled() {
      return this.props.selectable
   }

   isMultiline() {
      return this.props.display_scheme == "12-12-12-12"
   }

   spanValue() {
      let value = this.props.humanized_value

      if (this.isRangeEnabled() && this.state.start) {
         let pre = value.slice(0, this.state.start),
             mid = value.slice(this.state.start, this.state.end),
             post = value.slice(this.state.end, -1)

         return [<span className="plain">{pre}</span>,
                 <span className="plain selected">{mid}</span>,
                 <span className="plain">{post}</span>]
      } else {
         return <span className="plain">{value}</span>
      }
   }

   // render
   render() {
      console.log("[render] * props:", this.props, "state: ", this.state)

      return (
         <div
            ref={e => this.$span = e}
            className={this.className()}>
            {this.props.value &&
               <div
                  className="chip">
                  <span
                     className={this.spanClassName()}>
                     {this.spanValue()}</span>
                  <i
                     className='material-icons unfix'
                     onClick={this.onChipAct.bind(this)}>
                     close</i>
               {this.isRangeEnabled() && this.state.pendingRange &&
                  <a
                     style={this.getApplierPositionCss()}
                     onClick={() => {this.onApplyRange()}}
                     className="popup btn-floating btn-small waves-effect waves-light terracota">
                     <i className="small material-icons">fingerprint</i></a>}
               </div>}
            {!this.props.value &&
               <input
                  type='text'
                  className={"dynamic " + (this.getErrorText(this.props.value) && 'invalid')}
                  ref={e => this.$input = e}
                  key={'input-' + this.props.name}
                  id={this.props.name}
                  name={this.props.name}
                  placeholder={this.props.placeholder}
                  value={this.props.humanized_value || ''}
                  onChange={this.onChange.bind(this)} />}
            <label
               className='active'
               htmlFor={this.props.name}>
               {this.props.title}
               <ErrorSpan
                  error={this.getErrorText(this.props.value)} /></label></div>)}}
