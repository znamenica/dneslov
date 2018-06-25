import { Component } from 'react'

import BooleanBox from 'BooleanBox'

export default class FeasibleBox extends BooleanBox {
   static defaultProps = {
      name_key: 'feasible',
      title: 'Вероятное'
   }
}
