import { Component } from 'react'

export default class CatchWrapper extends Component {
   state = { error: null, errorInfo: null }

   componentDidCatch(error, errorInfo) {
      this.setState({
         error: error,
         errorInfo: errorInfo
      });
   }

   render() {
      if (this.state.errorInfo) {
         return [
            <a
               href="#"
               className="chip dropdown-trigger"
               data-target="error-info"
               id='error-chip'>
               <span
                  className="error">
                  {this.state.error && this.state.error.toString()}</span></a>,
            <ul
               id='error-info'
               className='dropdown-content'>
               <li>
                  <details
                     style={{ whiteSpace: "pre-wrap" }}>
                     {this.state.errorInfo.componentStack}</details></li></ul>,
            <label
               className='active'
               htmlFor="error-chip">
               {'Error'}</label>]
      }

      return this.props.children;
   }
}
