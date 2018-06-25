import { Component } from 'react'

import BooleanBox from 'BooleanBox'

export default class LicitBox extends BooleanBox {
   static defaultProps = {
      name_key: 'licit',
      title: 'Опубликовать'
   }
}
