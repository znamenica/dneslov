const event_types = ['Resurrection', 'Repose', 'Writing', 'Appearance', 'Translation', 'Sanctification']

export function makeTweet(props) {
   let tweets = props.locales.map((locale) => {
      return props.tweets.reduce((res, tweet) => {
         return res || locale === tweet.language_code && tweet.text }, null)
   }).filter((e) => { return e })

   if (tweets[0] && tweets[0].length > 27) {
      return tweets[0].slice(0, 27) + '...'
   } else {
      return tweets[0] || ''
   }
}

export function makeNote(props) {
   let notes = props.locales.map((locale) => {
      return props.notes.reduce((res, note) => {
         return res || locale === note.language_code && note.text }, null)
   }).filter((e) => { return e })

   if (notes[0] && notes[0].length > 27) {
      return notes[0].slice(0, 27) + '...'
   } else {
      return notes[0] || ''
   }
}

export function makeName(props) {
   let names = props.locales.map((locale) => {
      return props.names.reduce((res, name) => {
         return res || locale === name.language_code && name.text }, null)
   }).filter((e) => { return e })

   return names[0] || ''
}

export function makeDate(props) {
   let dates = [...event_types].map((event_type) => {
      return props.events.reduce((res, event) => { return event.type == event_type && event.happened_at || res }, null)
   }).filter((e) => { return e })

   return dates[0] || ''
}

export function makeCouncil(props) {
   if (props.council && props.council.length > 17) {
      return props.council.slice(0, 17) + '...'
   } else {
      return props.council || ''
   }
}

export function makeDescription(props) {
   let descriptions = props.locales.map((locale) => {
      return props.descriptions.reduce((res, description) => {
         return res || locale === description.language_code && description.text }, null)
   }).filter((e) => { return e })

   if (descriptions[0] && descriptions[0].length > 27) {
      return descriptions[0].slice(0, 27) + '...'
   } else {
      return descriptions[0] || ''
   }
}

