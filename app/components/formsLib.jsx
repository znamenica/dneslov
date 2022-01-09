import BooleanBox from 'BooleanBox'
import TextField from 'TextField'
import SelectField from 'SelectField'
import DynamicField from 'DynamicField'
import Collection from 'Collection'
import Block from 'Block'
import HiddenField from 'HiddenField'
import TextArea from 'TextArea'
import JsonEditor from 'JsonEditor'

export function kindToKlass(kind) {
   const klassTable = {
      hidden: HiddenField,
      boolean: BooleanBox,
      tale: TextArea,
      json: JsonEditor,
      text: TextField,
      select: SelectField,
      dynamic: DynamicField,
      block: Block,
      collection: Collection,
   }

   let klass = klassTable[kind]

   if (!klass) {
      console.error("Undefined klass for the kind: " + kind)
   }

   return klass
}
