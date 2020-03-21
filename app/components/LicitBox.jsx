import { Component } from 'react'

import BooleanBox from 'BooleanBox'

export default class LicitBox extends BooleanBox {
   static defaultProps = {
      name: 'licit',
      title: 'Опубликовать'
   }
}
