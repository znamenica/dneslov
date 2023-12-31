import { Component } from 'react'

import PureImage from 'PureImage'

export default class Image extends Component {
   static defaultProps = {
      url: null,
      thumb: null,
      title: null,
      description: null,
      index: null,

      wrapperClassName: "",
      onLoad: null,
      onError: null,
      i18n: {
         look_in: "Посмотреть",
         close: "Закрыть"
      }
   }

   state = {
      loaded: false,
      errored: false,
   }

   // system
   constructor(props) {
      super(props)

      this.onDocumentClick = this.onDocumentClick.bind(this)
   }

   componentDidMount() {
      document.addEventListener('click', this.onDocumentClick, { passive: true })
      this.modal = M.Modal.init(this.$modal, {})
   }

   componentWillUnmount() {
      document.removeEventListener('click', this.onDocumentClick)
   }

   stateChanged() {
      if (this.state.errored) {
         //this.componentReady()
         this.props.onError && this.props.onError(this.props.index)
      } else if (this.state.loaded) {
         //this.componentReady()
         this.props.onLoad && this.props.onLoad(this.props.index)
      }
   }

   onDocumentClick(e) {
      // TODO click to transparent area of the modal, get fired to the modal, not the
      // page. Fix it then.
      if (! e.cancelBubble && this.isOpen() && ! e.target.closest('.modal')) {
         this.modal.close()
      }
   }

   onImageCompleted(e) {
      let errored = false

      if (e && e.type === "error") {
         errored = true
      }

      this.setState((prevState) => { return { loaded: !errored, errored: errored }}, this.stateChanged.bind(this))
   }

   onIconClick(e) {
      this.modal.open()
      console.debug("wwwww", this.modal)
   }

   isOpen() {
      return this.$modal && this.$modal.classList.contains('open')
   }

   render() {
      console.debug("[render] **", { 'this.props': this.props, 'this.state': this.state })

      return (
         !this.state.errored && <div
            className="card hoverable medium">
            <div className="card-image">
               <img
                  alt={this.props.title}
                  src={this.props.thumb}
                  className={this.props.wrapperClassName}
                  data-index={this.props.index}
                  onLoad={this.onImageCompleted.bind(this)}
                  onError={this.onImageCompleted.bind(this)} />
               <span
                  className="card-title">
                  {this.props.title || "rrrr"}</span></div>
            <div className="card-content">
               <p>{this.props.description || "eeee"}</p></div>
            <div
               className="card-action"
               onClick={this.onIconClick.bind(this)} >
               {this.props.i18n.look_in}</div>
            <div
               className='modal'
               key={'image-modal'}
               id={'image-popup-modal-' + this.props.uid}
               ref={e => this.$modal = e} >
               <div className='modal-content'>
                  <div
                     className='frame js_frame'>
                     <PureImage
                        key={this.props.uid}
                        id={this.props.uid}
                        wrapperClassName='icon'
                        src={this.props.url}
                        alt={this.props.description}
                        onLoad={this.onImageCompleted.bind(this)} /></div></div>
               <a
                  className='modal-action modal-close waves-effect btn-flat pulse chip'>
                  {this.props.i18n.close}</a></div></div>)
   }
}
