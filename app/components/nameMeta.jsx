import { matchLanguages, matchAlphabeths, matchLetters, matchEmptyObject, matchCodes, matchEmptyCollection } from 'matchers'

export const nameMeta = {
   default: "text",
   remoteName: 'name',
   remoteNames: 'names',
   title: 'Имена',
   new: 'Новое имя',
   update: 'Обнови имя',
   create: 'Создай имя',
   close: 'Закрой',
   remove: {
      title: 'Точно ли удалить имя %default?',
      yes: "Да"
   },
   row: {
      text: {
         title: 'Написание',
      },
      language_code: {
         title: 'Язык',
      },
      alphabeth_code: {
         title: 'Азбука',
      },
      bind_kind: {
         title: 'Связка',
      },
      bond_to: {
         title: 'Связано с...',
      },
      root: {
         title: 'Корневое имя',
      },
   },
   form: {
      text: {
         kind: 'text',
         name: 'text',
         title: 'Написание имени',
         placeholder: 'Введи написание имени',
         display_scheme: '12-6-4-2',
         validations: {
            "Имя отсутствует": matchEmptyObject,
         },
      },
      language_code: {
         kind: 'dynamic',
         title: 'Язык',
         display_scheme: '12-6-4-2',
         pathname: 'short_subjects',
         humanized_name: 'language',
         context_value: { k: "Language" },
         key_name: 'name',
         value_name: 'key',
         placeholder: 'Начни ввод наименования языка...',
         validations: {
            'Избранный язык не соотвествует избранной азбуке': matchCodes,
            'Язык из списка должен быть выбран': matchEmptyObject,
         }
      },
      alphabeth_code: {
         kind: 'dynamic',
         title: 'Азбука',
         display_scheme: '12-6-4-2',
         pathname: 'short_subjects',
         humanized_name: 'alphabeth',
         context_value: { k: "Alphabeth" },
         key_name: 'name',
         value_name: 'key',
         placeholder: 'Начни ввод наименования азбуки...',
         validations: {
            'Избранная азбука не соотвествует избранному языку': matchCodes,
            'Азбука из списка должна быть выбрана': matchEmptyObject,
         }
      },
      bond_to_id: {
         kind: 'dynamic',
         title: 'Связаное имя',
         humanized_name: 'bond_to',
         display_scheme: '12-6-4-2',
         placeholder: 'Начни ввод имени...',
         pathname: 'short_names',
         key_name: 'name',
         value_name: 'id',
         validations: {
            'Связаное имя не должно соответствовать названию текущего имени': (value, context) => {
               return value && value == context.id
            },
         }
      },
      bind_kind: {
         humanized_name: 'bind_kind_name',
         kind: 'dynamic',
         display_scheme: '12-6-4-2',
         title: 'Вид связки',
         placeholder: 'Начни ввод связки...',
         pathname: 'short_subjects',
         context_value: { k: "BindKind" },
         key_name: 'name',
         value_name: 'key',
         validations: {
            'Вид связки из списка должен быть выбран': matchEmptyObject,
            'Вид связки не должен иметь значение "Не связанное" в случае, если связаное имя задано': (value, context) => {
               return context.bond_to_id && value == "несвязаное"
            },
            'Вид связки должен иметь значение "Не связанное" в случае, если связаное имя отсутствует': (value, context) => {
               return !context.bond_to_id && value != "несвязаное"
            },
         }
      },
      root_id: {
         kind: 'dynamic',
         humanized_name: 'root',
         title: 'Корневое имя',
         display_scheme: '12-6-4-2',
         placeholder: 'Начни ввод имени...',
         pathname: 'short_names',
         key_name: 'name',
         value_name: 'id',
      },
   }
}
