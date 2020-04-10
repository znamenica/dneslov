import { merge } from 'merge-anything'

export function matchValidJson(text) {
   try {
      JSON.parse(text)
      return false
   } catch (e) {
      return true
   }
}

export function matchLetters(text, context) {
   let res = false

   console.debug("[matchLetters] > text:", text, "context:", context)

   switch (context.alphabeth_code) {
   case 'РУ':
      res = ! text.match(/^[А-ЯЁа-яё:,.!?;\-\/*()0-9«»́–—\r\n†№IVXLCDM \*~`\+\-#=>\[\]\(\)!]+$/)
      break
   case 'ЦС':
      res = ! text.match(/^[А-ЬЮЅІѠѢѦѮѰѲѴѶѸѺѼѾꙖꙊа-ьюєѕіѡѣѧѯѱѳѵѷѹѻѽѿꙗꙋ:,.!;\-\/*\r\n \*~`\+\-#=>\[\]\(\)!]+$/)
   case 'РП':
      res = ! text.match(/^[А-ЯЁІѢѲѴа-яёіѣѳѵ:,.!;\-\/*()0-9«»́–—\r\n \*~`\+\-#=>\[\]\(\)!]+$/)
      break
   case 'ЦР':
      res = ! text.match(/^[А-ЯЁа-яё_<>:,.!;\-\/*\r\n \*~`\+\-#=>\[\]\(\)!]+$/) //TODO
      break
   case 'СС':
      res = ! text.match(/^[А-ЬЮЅІѠѢѦѮѰѲѴѶѸѺѾꙖа-ьюєѕіѡѣѧѯѱѳѵѷѹѻѿꙗ.,;*\r\n \*~`\+\-#=>\[\]\(\)!]+$/) //TODO
      break
   case 'УК':
      res = ! text.match(/^[А-ЩЬЮЯЄІЇҐа-щьюяєіїґ:,.!?\-()0-9́«»–—\r\n \*~`\+\-#=>\[\]\(\)!]+$/)
      break
   case 'БЛ':
      res = ! text.match(/^[:,.()0-9«»–\r\n \*~`\+\-#=>\[\]\(\)!]+$/) //TODO
      break
   case 'МК':
      res = ! text.match(/^[:,.()0-9\r\n \*~`\+\-#=>\[\]\(\)!]+$/) //TODO
      break
   case 'СР':
      res = ! text.match(/^[ЂЈ-ЋЏА-ИК-Шђј-ћа-ик-ш:,.!?\-\/()0-9\r\n \*~`\+\-#=>\[\]\(\)!]+$/)
      break
   case 'ХР':
      res = ! text.match(/^[A-PR-VZČĆŽĐŠa-pr-vzčćžđš:,.()0-9\r\n \*~`\+\-#=>\[\]\(\)!]+$/) //TODO
      break
   case 'СО':
      res = ! text.match(/^[:,.()0-9\r\n \*~`\+\-#=>\[\]\(\)!]+$/) //TODO
      break
   case 'БГ':
      res = ! text.match(/^[А-ЪЬЮЯа-ъьюя:,.!?\-\/()0-9\r\n \*~`\+\-#=>\[\]\(\)!]+$/)
      break
   case 'ЧХ':
      res = ! text.match(/^[A-PR-VX-ZÁÉĚÍÓÚŮÝČĎŇŘŠŤŽa-pr-vx-záéěíóúůýčďňřšťž:,.!?\-()0-9\r\n \*~`\+\-#=>\[\]\(\)!]+$/) //TOOD
      break
   case 'СЛ':
      res = ! text.match(/^[:,.()0-9\r\n \*~`\+\-#=>\[\]\(\)!]+$/) //TODO
      break
   case 'ПО':
      res = ! text.match(/^[:,.()0-9\r\n \*~`\+\-#=>\[\]\(\)!]+$/) //TODO
      break
   case 'АР':
      res = ! text.match(/^[Ա-Ֆա-և:,.!?\-()0-9\r\n \*~`\+\-#=>\[\]\(\)!]+$/)
      break
   case 'ИВ':
      res = ! text.match(/^[ა-ჺჽა-ჺჽ:,.!?\-()0-9\r\n \*~`\+\-#=>\[\]\(\)!]+$/)
      break
   case 'РМ':
      res = ! text.match(/^[A-ZĂÂÎȘȚa-zăâîșț:,.!?\-()0-9\r\n \*~`\+\-#=>\[\]\(\)!]+$/)
      break
   case 'ЦУ':
      res = ! text.match(/^[:,.\r\n \*~`\+\-#=>\[\]\(\)!]+$/) //TODO
      break
   case 'ГР':
      res = ! text.match(/^[ͶͲΑ-ΫϏϒϓϔϘϚϜϠϞϴϷϹϺϾϿἈ-ἏἘ-ἝἨ-ἯἸ-ἿὈ-ὍὙ-ὟὨ-Ὧᾈ-ᾏᾘ-ᾟᾨ-ᾯᾸ-ᾼῈ-ῌῘ-ΊῨ-ῬῸ-ῼΩΆ-Ώά-ώϐϑϕ-ϗϙϛϝ-ϟϡ-ϳϵ-϶ϸϻϼᴦ-ᴪἀ-ἇἐ-ἕἠ-ἧἰ-ἷὀ-ὅὐ-ὗὠ-ὧὰ-ᾇᾐ-ᾗᾠ-ᾧᾰ-ᾷῂ-ῇῐ-ῗῠ-ῧῲ-ῷͻ-ͽͷΐά-ΰ«»'’"`,;;:.·˙©~\-\+\.()0-9\r\n \*~`\+\-#=>\[\]\(\)!]+$/)
      break
   case 'ЛА':
      res = ! text.match(/^[A-IK-TVX-ZÆa-ik-tvx-zæ:,.\-\r\n \*~`\+\-#=>\[\]\(\)!]+$/)
      break
   case 'ИТ':
      res = ! text.match(/^[A-IL-VZa-il-vz:,.!?\-()0-9\r\n \*~`\+\-#=>\[\]\(\)!]+$/)
      break
   case 'ФР':
      res = ! text.match(/^[A-ZŒÆÇÀÂÎÏÛÙÜÉÈÊËÔŸÑa-zœæçàâîïûùüéèêëôÿñ:,.!?\-()0-9\r\n \*~`\+\-#=>\[\]\(\)!]+$/)
      break
   case 'ИС':
      res = ! text.match(/^[A-ZÑÁÉÍÓÚÜÏa-zñáéíóúüï:,.()0-9\r\n \*~`\+\-#=>\[\]\(\)!]+$/)
      break
   case 'НЕ':
      res = ! text.match(/^[A-ZÄÖÜẞa-zäöüßſ:,.()0-9\r\n \*~`\+\-#=>\[\]\(\)!]+$/)
      break
   case 'ИР':
      res = ! text.match(/^[A-IL-PR-Ua-il-pr-u:,.()0-9\r\n \*~`\+\-#=>\[\]\(\)!]+$/)
      break
   case 'СИ':
      res = ! text.match(/^[:,.\r\n \*~`\+\-#=>\[\]\(\)!]+$/) //TODO
      break
   case 'АН':
      res = ! text.match(/^[A-Za-z:,.!?\-()0-9\r\n \*~`\+\-#=>\[\]\(\)!]+$/)
      break
   case 'СА':
      res = ! text.match(/^[:,.\r\n \*~`\+\-#=>\[\]\(\)!]+$/) //TODO
      break
   case 'РА':
      res = ! text.match(/^[A-IL-PR-UW-YÆÐꝽÞǷĊĠĀĒĪŌŪa-il-pr-uw-yæðᵹſþƿċġāēīūō:,.!?\-()0-9\r\n \*~`\+\-#=>\[\]\(\)!]+$/) //TODO
      break
   case 'ЕВ':
      res = ! text.match(/^[א-ת׳״שׁ-זּטּ-לּמּנּסּףּפּצּ-ﭏ֑-ׇ:,.!?\-()0-9\r\n \*~`\+\-#=>\[\]\(\)!]+$/) //TODO
      break
   }

   return res
}

export function matchCodes(e_in, context) {
   let e = e_in || {}

   const language_tree = {
      ру: ['РП', 'РУ'],
      цс: ['ЦС', 'РП', 'РУ', 'ЦР' ],
      сс: ['СС'],
      ук: ['УК'],
      бл: ['БЛ'],
      мк: ['МК'],
      сх: ['СР', 'ХР'],
      со: ['СО'],
      бг: ['БГ'],
      чх: ['ЧХ'],
      сл: ['СЛ'],
      по: ['ПО'],
      кш: ['КШ'],
      вл: ['ВЛ'],
      нл: ['НЛ'],
      ар: ['АР'],
      ив: ['ИВ'],
      рм: ['РМ', 'ЦУ', 'цр'],
      гр: ['ГР'],
      ла: ['ЛА'],
      ит: ['ИТ'],
      фр: ['ФР'],
      ис: ['ИС'],
      не: ['НЕ'],
      ир: ['ИР'],
      си: ['СИ'],
      ан: ['АН', 'СА', 'РА'],
   }

   console.debug("[matchCodes] > e:", e, "context:", context)
   if (e) {
      let alphabeth_codes = language_tree[context.language_code]

      return alphabeth_codes &&
             context.alphabeth_code &&
             alphabeth_codes.indexOf(context.alphabeth_code) < 0
   }
}

export function matchLanguages(hash) {
   let languages = []

   Object.entries(hash || {}).forEach(([key, value]) => {
      languages.push(value.language_code)
   })

   languages.forEach((l, i) => {if (languages.indexOf(l, i + 1)) { return true }})
   return false
}

export function matchAlphabeths(hash) {
   let alphabeths = []

   Object.entries(hash || {}).forEach(([key, value]) => {
      alphabeths.push(value.alphabeth_code)
   })

   alphabeths.forEach((a, i) => {if (alphabeths.indexOf(a, i + 1)) { return true }})
   return false
}

export function matchEmptyCollection(value, context) {
   return value.reduce((res, v) => { return res && v.value._destroy }, true)
}

export function matchEmptyObject(value, context) {
   let res = false

   console.debug("[matchEmptyObject] >", value)

   if (value === null || value === undefined) {
      res = true
   } else {
      switch(value.constructor.name) {
      case 'Number':
         break
      case 'Array':
         res = value.length == 0

         break
      case 'Object':
         res = Object.values(value).length == 0

         break
      default:
         res = !value
      }
   }

   return res
}
