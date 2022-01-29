import { merge } from 'merge-anything'

import CatchWrapper from 'CatchWrapper'
import { kindToKlass } from 'formsLib'
import { displaySchemeToWrapperClass, valueContextRules } from 'support'

export function renderElement(element, meta) {
   console.debug("[renderElement] << element:", element, "meta:", meta)

   let mapped = Object.getOwnPropertyNames(meta).reduce((metaResult, nameIn) => {
      let forIn = meta[nameIn].for,
          name = forIn || meta[nameIn].name || nameIn,
          dataIn = metaResult[name] || {},
          data = forIn ? {[nameIn]: element.value[nameIn]} : meta[nameIn]

      return metaResult.merge({[name]: dataIn.merge(data)})
   }, {})
   console.debug("[renderElement] ** mapped:", mapped)

   let rendered = Object.getOwnPropertyNames(mapped).map(name => {
      let sub = mapped[name],
          newName = [element.name, name].filter((x) => { return x }).join("."),
          newHumanizedName = [element.name, sub.humanized_name].filter((x) => { return x }).join("."),
          rulesContext = valueContextRules(sub.context_names),
          valueContext = Object.entries(rulesContext).reduce((res, [contextName, contextRule]) => {
             let valid = true

             if (typeof(contextRule) == "function") {
                res[contextName] = () => {
                   if (contextRule(element.value)) {
                      return element.value[contextName]
                   }
                }
             } else {
                res[contextName] = element.value[contextName]
             }

             return res
          }, sub.context_values || {}),
          // sourcedValue = element.value[sub["source"]] || element.value[name],
          sourcedValue = element.value[name],
          value = sourcedValue &&
                  sourcedValue.constructor.name === "Object" &&
                  sub["filter"] ?
                  sourcedValue.select((_, h) => {
                     console.debug("[renderElement] ** ", h.intersectWith(sub["filter"]), h.intersectWith(sub["filter"]).isPresent())
                     return h.intersectWith(sub["filter"]).isPresent()
                  }) : sourcedValue,
          res = merge(sub, { key: newName,
                             name: newName,
                             humanized_name: newHumanizedName,
                             value: value,
                             humanized_value: element.value[sub.humanized_name],
                             value_context: valueContext,
                             validation_context: element.value,
                             wrapperClassName: displaySchemeToWrapperClass(sub.display_scheme) })

      console.debug("[renderElement] ****** source:", sub["source"], "filter:", sub["filter"], "value:", value, sourcedValue, element.value[sub["source"]], sourcedValue && sourcedValue.select((_, h) => {
            return h.intersectWith(sub["filter"]).isPresent()
         }))
      self.klass = kindToKlass(sub['kind'])
      console.debug("[renderElement] ** result object", res, "klass:", self.klass)
      return <CatchWrapper><self.klass {...res} /></CatchWrapper>
   })

   console.debug("[renderElement] >", rendered)

   return rendered
}
