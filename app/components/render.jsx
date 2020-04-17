import { merge } from 'merge-anything'

import CatchWrapper from 'CatchWrapper'
import { kindToKlass } from 'formsLib'
import { displaySchemeToWrapperClass } from 'support'

export function renderElement(element, meta) {
   console.debug("[renderElement] > meta:", meta, "e:", element)

   let rendered = Object.getOwnPropertyNames(meta).map(_name => {
      let sub = meta[_name],
          name = sub.name || _name,
          new_name = [ element.name, name ].filter((x) => { return x }).join("."),
          new_humanized_name = [ element.name, sub.humanized_name ].filter((x) => { return x }).join("."),
          value_context_names = [ sub.context_names ].flat().filter((x) => { return x }),
          value_context = value_context_names.reduce((res, context_name) => {
             res[context_name] = element.value[context_name]
             return res
          }, sub.context_values || {}),
          res = merge(sub, { key: new_name,
                             name: new_name,
                             humanized_name: new_humanized_name,
                             value: element.value[name],
                             humanized_value: element.value[sub.humanized_name],
                             value_context: value_context,
                             validation_context: element.value,
                             wrapperClassName: displaySchemeToWrapperClass(sub.display_scheme) })


      self.klass = kindToKlass(sub['kind'])
      console.debug("[renderElement] > result object", res, "klass:", self.klass)
      return <CatchWrapper><self.klass {...res} /></CatchWrapper>
   })

   console.debug("[renderElement] >>>", rendered)

   return rendered
}
