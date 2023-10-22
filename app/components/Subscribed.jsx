const Subscribed = {
   onSubscribedChanged(e) {
      console.debug("[onSubscribedChanged] <<< ", e.detail)
      let relaPath = this.subscribeTo.find((v) => { return e.detail.path == v })

      if (relaPath && this.getErrorText(this.props.value)) {
         this.forceUpdate()
      }
   },
//   componentDidMount1() {
   onSubscribedChanged1() {
      console.debug("[componentDidMount1]2 ** ", this.data, this.props.value)

      if (this.props.subscribeTo) {
         let parentPath = this.props.name.split(".").slice(0, -1).join('.') + '.'
         this.subscribeTo = [this.props.subscribeTo].flat().map((v) => {
            return v.replace(/@/, parentPath)
         })

         document.addEventListener('dneslov-update-path', this.onSubscribedChanged, { passive: true })
      }
   },
}

export default Subscribed
