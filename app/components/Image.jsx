import { Component } from 'react'

export default class Image extends Component {
   static defaultProps = {
      src: null,
      alt: null,
      index: null,
      wrapperClassName: "",
      onLoad: null,
      onError: null
   }

   state = {
      loaded: false,
      errored: false,
   }

   stateChanged() {
      if (this.state.errored) {
         this.props.onError && this.props.onError(this.props.index)
      } else if (this.state.loaded) {
         this.props.onLoad && this.props.onLoad(this.props.index)
      }
   }

   onImageCompleted(e) {
      let errored = false

      // All images with height below 300px we treat as invalid
      if (e.type === "error" || e.target.naturalHeight < 300) {
         errored = true
      }

      this.setState((prevState) => { return { loaded: !errored, errored: errored }}, this.stateChanged.bind(this))
   }

   render() {
      console.debug("[render] **", { 'this.props': this.props, 'this.state': this.state })

      return (
         !this.state.errored && <img
            alt={this.props.alt}
            src={this.props.src}
            className={this.props.wrapperClassName}
            data-index={this.props.index}
            onLoad={this.onImageCompleted.bind(this)}
            onError={this.onImageCompleted.bind(this)} />)}}
