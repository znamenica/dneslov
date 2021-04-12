const event_types = ['Resurrection', 'Repose', 'Writing', 'Appearance', 'Translation', 'Sanctification']

export function makeTweet(value, props) {
   let tweets = props.locales.map((locale) => {
      return value.tweets.reduce((res, tweet) => {
         return res || locale === tweet.language_code && tweet.text }, null)
   }).filter((e) => { return e })

   if (tweets[0] && tweets[0].length > 27) {
      return tweets[0].slice(0, 27) + '...'
   } else {
      return tweets[0] || ''
   }
}

export function makeNote(value, props) {
   let notes = props.locales.map((locale) => {
      return value.notes.reduce((res, note) => {
         return res || locale === note.language_code && note.text }, null)
   }).filter((e) => { return e })

   if (notes[0] && notes[0].length > 27) {
      return notes[0].slice(0, 27) + '...'
   } else {
      return notes[0] || ''
   }
}

export function makeName(value, props) {
   let names = props.locales.map((locale) => {
      return value.names.reduce((res, name) => {
         return res || locale === name.language_code && name.text }, null)
   }).filter((e) => { return e })

   return names[0] || ''
}

export function makeTitle(value, props) {
   let titles = props.locales.map((locale) => {
      return value.titles.reduce((res, title) => {
         return res || locale === title.language_code && title.text }, null)
   }).filter((e) => { return e })

   return titles[0] || ''
}

export function makeDate(value) {
   let dates = [...event_types].map((event_type) => {
      return value.events.reduce((res, event) => { return event.type == event_type && event.happened_at || res }, null)
   }).filter((e) => { return e })

   return dates[0] || ''
}

export function makeCouncil(value) {
   if (value.council && value.council.length > 17) {
      return value.council.slice(0, 17) + '...'
   } else {
      return value.council || ''
   }
}

export function makeDescription(value, props) {
   let descriptions = props.locales.map((locale) => {
      return value.descriptions.reduce((res, description) => {
         return res || locale === description.language_code && description.text }, null)
   }).filter((e) => { return e })

   if (descriptions[0] && descriptions[0].length > 27) {
      return descriptions[0].slice(0, 27) + '...'
   } else {
      return descriptions[0] || ''
   }
}

