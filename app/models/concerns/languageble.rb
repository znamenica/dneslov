module Languageble
   extend ActiveSupport::Concern

   RUSSIAN_CAPITAL = 'А-ЯЁІѢѲѴ'
   RUSSIAN_STROKE = 'а-яёіѣѳѵ'
   RUSSIAN_ACCENT = '́'
   MODIFIED_RUSSIAN_CAPITAL = 'А-ЯЁ'
   MODIFIED_RUSSIAN_STROKE = 'а-яё'
   MODIFIED_RUSSIAN_ACCENT = '́'
   OLD_RUSSIAN_CAPITAL = 'А-ЬЮЄЅІЇѠѢѤѦѨѪѬѮѰѲѴѸѺꙀꙂꙆꙈꙊꙐꙒꙖ'
   OLD_RUSSIAN_STROKE = 'а-ьюєѕіїѡѣѥѧѩѫѭѯѱѳѵѹѻꙁꙃꙇꙉꙋꙑꙓꙗ'
   OLD_RUSSIAN_ACCENT = ' ҃҄҇꙼꙽́̀'
   CSLAV_CAPITAL = 'А-ЬЮЄЅІѠѢѦѮѰѲѴѶѸѺѼѾꙖꙊ'
   CSLAV_STROKE = 'а-ьюєѕіѡѣѧѯѱѳѵѷѹѻѽѿꙗꙋ'
   CSLAV_ACCENT = '̀́̑͛҅҆҆҃҄҇҈҉ⷠⷡⷢⷣⷤⷥⷦⷧⷨⷩⷪⷫⷬⷭⷮⷯⷰⷱⷲⷳⷴⷵⷶⷷⷸⷹⷺⷼⷻⷽⷾⷿ꙯꙰꙱꙲꙳ꙴꙵꙶꙷꙸꙹꙺꙻ꙼꙽꙾ꙿꚜꚝꚞꚟ︮'
   SSLAV_CAPITAL = 'А-ЬЮЅІѠѢѦѮѰѲѴѶѸѺѼѾꙖꙊѺѾҀѠѤѨѪѬꙀꙂꙄꙆꙈꙊꙌꙎꙐꙒꙔꙖꙘꙚꙜꙞ'
   SSLAV_STROKE = 'а-ьюѕіѡѣѧѯѱѳѵѷѹѻѽѿꙗꙋѻѿҁѡѥѩѫѭꙁꙃꙅꙇꙉꙋꙍꙏꙑꙓꙕꙗꙙꙛꙝꙟ'
   SSLAV_ACCENT = '̀́̑͛҅҆҆҃҄҇҈҉ⷠⷡⷢⷣⷤⷥⷦⷧⷨⷩⷪⷫⷬⷭⷮⷯⷰⷱⷲⷳⷴⷵⷶⷷⷸⷹⷺⷼⷻⷽⷾⷿ꙯꙰꙱꙲꙳ꙴꙵꙶꙷꙸꙹꙺꙻ꙼꙽꙾ꙿꚜꚝꚞꚟ︮'
   KSLAV_CAPITAL = 'А-ЯѠҨЪѪꙘѢԘԐЄѦІѴꙊꙎꙚꙈЅҐЈꙆԪ'
   KSLAV_STROKE = 'а-яѡҩъѫꙙѣԙԑєѧіѵꙋꙏꙛꙉѕґјꙇԫ'
   KSLAV_ACCENT = '̀́̓̔҃҇҈҉꙽҃҄҇꙽҃҄҇꙽'
   KLSLAV_CAPITAL = 'A-PR-WYZĘŲǪŠČŽŚŹĆĽŔŤÍÒÈÅĐŻŃ'
   KLSLAV_STROKE = 'a-pr-wyzęųǫščžśźćľŕťíòèåđżń'
   KLSLAV_ACCENT = '́̃̋̈'
   MSLAV_CAPITAL = 'А-ЬЄЮѢЂЈ'
   MSLAV_STROKE = 'а-ьюєѣђј'
   MSLAV_ACCENT = '̀́̓̔҃҇҈҉꙽'
   MLSLAV_CAPITAL = 'A-PR-WYZĘŲǪŠČŽŚŹĆĽŔŤÍÒÈÅĐŻŃƖ'
   MLSLAV_STROKE = 'a-pr-wyzęųǫščžśźćľŕťíòèåđżńɩ'
   MLSLAV_ACCENT = '́̃̋̈'
   HIP_CAPITAL = 'А-ЯЁA-Z'
   HIP_STROKE = 'а-яёa-z'
   SERBIAN_CAPITAL = 'ЂЈ-ЋЏА-ИК-Ш'
   SERBIAN_STROKE = 'ђј-ћа-ик-ш'
   SERBIAN_ACCENT = '̀́̋̏'
   GREEK_CAPITAL = 'Ά-ΐΑ-Ϋ'
   GREEK_STROKE = 'ά-ΰα-ώ'
   GREEK_ACCENT = '΄´'
   OLD_GREEK_CAPITAL = 'Ά-ΏΑ-ΩἈἘἨἸὈὙὨ'
   OLD_GREEK_STROKE = 'ά-ώα-ωἀἐἠἰὀὑὠό-ώἄἔἤἴὄὔὤὰ-ώ'
   OLD_GREEK_ACCENT = '᾿῎῍῝῞`´῾'
   ANCIENT_GREEK_CAPITAL = 'ͶͲΑ-ΫϏϒϓϔϘϚϜϠϞϴϷϹϺϾϿἈ-ἏἘ-ἝἨ-ἯἸ-ἿὈ-ὍὙ-ὟὨ-Ὧᾈ-ᾏᾘ-ᾟᾨ-ᾯᾸ-ᾼῈ-ῌῘ-ΊῨ-ῬῸ-ῼΩΆ-Ώ'
   ANCIENT_GREEK_STROKE = 'ά-ώϐϑϕ-ϗϙϛϝ-ϟϡ-ϳϵ-϶ϸϻϼᴦ-ᴪἀ-ἇἐ-ἕἠ-ἧἰ-ἷὀ-ὅὐ-ὗὠ-ὧὰ-ᾇᾐ-ᾗᾠ-ᾧᾰ-ᾷῂ-ῇῐ-ῗῠ-ῧῲ-ῷͻ-ͽͷΐά-ΰ'
   ANCIENT_GREEK_ACCENT = 'ͺ͵΄᾽ι᾿῀῁῍῎῏῝῞῟῭΅`´῾'
   BULGARIAN_CAPITAL = 'А-ЪЬЮЯ'
   BULGARIAN_STROKE = 'а-ъьюя'
   LATIN_CAPITAL = 'A-IK-TVX-ZÆ'
   LATIN_STROKE = 'a-ik-tvx-zæ'
   LATIN_ACCENT = '̄̏̀́̅̋'
   IRISH_CAPITAL = 'A-IL-PR-U'
   IRISH_STROKE = 'a-il-pr-u'
   CZECH_CAPITAL = 'A-PR-VX-ZÁÉĚÍÓÚŮÝČĎŇŘŠŤŽ'
   CZECH_STROKE = 'a-pr-vx-záéěíóúůýčďňřšťž'
   CZECH_ACCENT = '́̌̊'
   UKRAINIAN_CAPITAL = 'А-ЩЬЮЯЄІЇҐ'
   UKRAINIAN_STROKE = 'а-щьюяєіїґ'
   ENGLISH_CAPITAL = 'A-Z'
   ENGLISH_STROKE = 'a-z'
   ITALIAN_CAPITAL = 'A-IL-VZ'
   ITALIAN_STROKE = 'a-il-vz'
   ARMENIAN_CAPITAL = 'Ա-Ֆ'
   ARMENIAN_STROKE = 'ա-և'
   IVERIAN_CAPITAL = 'ა-ჺჽ'
   IVERIAN_STROKE = 'ა-ჺჽ'
   ROMANIAN_CAPITAL = 'A-ZĂÂÎŞŢ'
   ROMANIAN_STROKE = 'a-zăâîşţ'
   OLD_ENGLISH_CAPITAL = 'A-IL-PR-UW-YÆÐꝽÞǷĊĠĀĒĪŌŪ'
   OLD_ENGLISH_STROKE = 'a-il-pr-uw-yæðᵹſþƿċġāēīūō'
   MIDDLE_ENGLISH_CAPITAL = 'A-ZÆ'
   MIDDLE_ENGLISH_STROKE = 'a-zæ'
   FRENCH_CAPITAL = 'A-ZŒÆÇÀÂÎÏÛÙÜÉÈÊËÔŸÑ'
   FRENCH_STROKE = 'a-zœæçàâîïûùüéèêëôÿñ'
   FRENCH_ACCENT = '́'
   SPANISH_CAPITAL = 'A-ZÑÁÉÍÓÚÜÏ'
   SPANISH_STROKE = 'a-zñáéíóúüï'
   GERMAN_CAPITAL = 'A-ZÄÖÜẞ'
   GERMAN_STROKE = 'a-zäöüßſ'
   NORWEGIAN_CAPITAL = 'A-ZÆØÅ'
   NORWEGIAN_STROKE = 'a-zæøå'
   NORWEGIAN_ACCENT = '́'
   DANISH_CAPITAL = 'A-ZÆØÅÖ'
   DANISH_STROKE = 'a-zæøåö'
   DANISH_ACCENT = '́'
   SWEDISH_CAPITAL = 'A-ZÄÅÖ'
   SWEDISH_STROKE = 'a-zäåö'
   SWEDISH_ACCENT = '́'
   ISLAND_CAPITAL = 'ABD-PR-VX-ZÁÐÉÍÓÚÝÞÆÖ'
   ISLAND_STROKE = 'abd-pr-vx-záðéíóúýþæö'
   ISLAND_ACCENT = '́'
   FAROESE_CAPITAL = 'A-ZÁÐÍÓÚÝÞÆØÖÜ'
   FAROESE_STROKE = 'a-záðíóúýþæøöü'
   FAROESE_ACCENT = '́'
   DUTCH_CAPITAL = 'A-ZĲ'
   DUTCH_STROKE = 'a-zĳ'
   DUTCH_ACCENT = '́̈'
   PORTUGUESE_CAPITAL = 'A-ZÁÂÃÀÇÉÊÍÓÔÕÚ'
   PORTUGUESE_STROKE = 'a-záâãàçéêíóôõú'
   PORTUGUESE_ACCENT = '̧̀́̂̃'
   GOTHIC_STROKE = '𐌰-𐍊'
   COPTIC_CAPITAL = 'ϢϤϦϨϪϬϮⲀⲂⲄⲆⲈⲊⲌⲎⲐⲒⲔⲖⲘⲚⲜⲞⲠⲢⲤⲦⲨⲪⲬⲮⲰⳀⳈⳊ'
   COPTIC_STROKE = 'ϣϥϧϩϫϭϯⲁⲃⲅⲇⲉⲋⲍⲏⲑⲓⲕⲗⲙⲛⲝⲟⲡⲣⲥⲧⲩⲫⲭⲯⲱⳁⳉⳋ'
   FINNISH_CAPITAL = 'A-ZŠŽÅÄÖ'
   FINNISH_STROKE = 'a-zšžåäö'
   FINNISH_ACCENT = '̈̊̌'
   ESTONIAN_CAPITAL = 'A-ZŠŽÕÄÖÜ'
   ESTONIAN_STROKE = 'a-zšžõäöü'
   ESTONIAN_ACCENT = '̈́̌'
   LATVIAN_CAPITAL = 'A-ZĀČĒĢĪĶĻŅŠŪŽ'
   LATVIAN_STROKE = 'a-zāčēģīķļņšūž'
   LATVIAN_ACCENT = '̄̌'
   LITHUANIAN_CAPITAL = 'A-ZĄČĘĖĮŲŠŽŪ'
   LITHUANIAN_STROKE = 'a-ząčęėįųšžū'
   LITHUANIAN_ACCENT = '̨̇'
   UPPER_ANCIENT_GERMANIC_CAPITAL = 'A-ZÄÖÜẞ'
   UPPER_ANCIENT_GERMANIC_STROKE = 'a-zäöüßſ'
   LOWER_ANCIENT_GERMANIC_CAPITAL = 'A-ZÄÖÜẞ'
   LOWER_ANCIENT_GERMANIC_STROKE = 'a-zäöüßſ'
   OLD_HEBREW_STROKE = 'א-תשׁ-זּטּ-לּמּנּסּףּפּצּ-ﭏ'
   OLD_HEBREW_ACCENT = '׳״ׇ֑-ׇ'
   HEBREW_STROKE = '׆א-תײַ-﬩'
   HEBREW_ACCENT = '׳״ׇ֑-ׇ'
   ARAMAIC_STROKE = 'א-תשׁ-זּטּ-לּמּנּסּףּפּצּ-ﭏ'
   ARAMAIC_ACCENT = '׳״ׇ֑-ׇ'
   ARABIC_STROKE = 'ء-غف-ي١-٩ٮ-ہۆ-ە۱-۹ﭐ-ﮯﯓ-ﯩﯼ-ﯿ'

   RUSSIAN_SYNTAX = ' \(\)\.,:;!\/\-«»\—\?\–№†IVXLCDM'
   OLD_RUSSIAN_SYNTAX = ' \<\>\[\]\.,:;·⁖჻᛭⁘⁙\/\-\—\–†'
   HIP_SYNTAX = ' \(\[\{\/\'\+\.\:\!"=~@#\$%\^&\*_\)\]\}\\\\`\-,;?\|'
   MODIFIED_RUSSIAN_SYNTAX = ' \(\)\.,:;\!\/\-«»\—\?†IVXLCDM©–№\'\[\]&^'
   CSLAV_SYNTAX = ' \(\)\.,:;'
   KSLAV_SYNTAX = ' \(\)\.,:;·⁖჻᛭⁘⁙'
   MSLAV_SYNTAX = ' \(\)\.,:;·⁖჻᛭⁘⁙'
   SERBIAN_SYNTAX = ' \(\)\.,\!:;“”\/'
   GREEK_SYNTAX = ' \(\)~\+\(\)\-\.,;;:.·˙\!«»\'’"`©\/' # TODO last 4 to fix and merge
   OLD_GREEK_SYNTAX = ' ~\+\-\.,;;:.·˙\!\'"\/'
   ANCIENT_GREEK_SYNTAX = ' ~\+\-\.,;;:.·˙\!\'"\/'
   BULGARIAN_SYNTAX = ' \(\)\.,'
   UKRAINIAN_SYNTAX = ' \(\)\.,—’;\/:'
   LATIN_SYNTAX = ' \(\)\.,<\>'
   IRISH_SYNTAX = ' \(\)\.,'
   CZECH_SYNTAX = ' \(\)\.,'
   ENGLISH_SYNTAX = ' \(\)\.,’\/\!\-:;\>"'
   ITALIAN_SYNTAX = ' \(\)\.,'
   ARMENIAN_SYNTAX = ' \(\)\.,'
   IVERIAN_SYNTAX = ' \(\)\.,:;\-\!'
   ROMANIAN_SYNTAX = ' \(\)\.,;:\-\!'
   OLD_ENGLISH_SYNTAX = ' \(\)\.,\/\>'
   MIDDLE_ENGLISH_SYNTAX = ' \(\)\.,;\/\!\-:;’\>'
   FRENCH_SYNTAX = ' \(\)\.,’\/'
   SPANISH_SYNTAX = ' \(\)\.,'
   GERMAN_SYNTAX = ' \(\)\.,'
   HEBREW_SYNTAX = ' \(\)\.,'

   SPECIFIC_SYNTAX = '\*~`\+\-#=>\[\]\(\)\!'
   DIGITS = '0-9'

   UPCHAR = RUSSIAN_CAPITAL + MODIFIED_RUSSIAN_CAPITAL + CSLAV_CAPITAL + SERBIAN_CAPITAL + GREEK_CAPITAL +
      ENGLISH_CAPITAL + LATIN_CAPITAL + CZECH_CAPITAL + ARMENIAN_CAPITAL +
      ROMANIAN_CAPITAL + OLD_ENGLISH_CAPITAL + IVERIAN_CAPITAL + GERMAN_CAPITAL + UKRAINIAN_CAPITAL + MIDDLE_ENGLISH_CAPITAL +
      MSLAV_CAPITAL + KSLAV_CAPITAL + MLSLAV_CAPITAL + KLSLAV_CAPITAL + OLD_RUSSIAN_CAPITAL + OLD_GREEK_CAPITAL + ANCIENT_GREEK_CAPITAL
   DOWNCHAR = RUSSIAN_STROKE + MODIFIED_RUSSIAN_STROKE + CSLAV_STROKE + SERBIAN_STROKE + GREEK_STROKE +
      ENGLISH_STROKE + LATIN_STROKE + CZECH_STROKE + ARMENIAN_STROKE +
      IVERIAN_STROKE + ROMANIAN_STROKE + OLD_ENGLISH_STROKE + GERMAN_STROKE + UKRAINIAN_STROKE + MIDDLE_ENGLISH_STROKE +
      HEBREW_STROKE + MSLAV_STROKE + KSLAV_STROKE + MLSLAV_STROKE + KLSLAV_STROKE + OLD_RUSSIAN_STROKE +
      OLD_GREEK_STROKE + ANCIENT_GREEK_STROKE + OLD_HEBREW_STROKE + ARABIC_STROKE
   ACCENT = GREEK_ACCENT + RUSSIAN_ACCENT + CSLAV_ACCENT + FRENCH_ACCENT + HEBREW_ACCENT + MSLAV_ACCENT + KSLAV_ACCENT +
      MLSLAV_ACCENT + KLSLAV_ACCENT + OLD_RUSSIAN_ACCENT + OLD_GREEK_ACCENT + ANCIENT_GREEK_ACCENT
   CHAR = DOWNCHAR + UPCHAR

   # TODO уравнять с LANGUAGE_TREE.alphabeths
   SYNTAX_TABLE = {
      :РП => RUSSIAN_SYNTAX,
      :РУ => MODIFIED_RUSSIAN_SYNTAX,
      :ДР => OLD_RUSSIAN_SYNTAX,
      :ЦР => HIP_SYNTAX,
      :ЦС => CSLAV_SYNTAX,
      :СР => SERBIAN_SYNTAX,
      :ГР => GREEK_SYNTAX,
      :СГ => OLD_GREEK_SYNTAX,
      :ДГ => ANCIENT_GREEK_SYNTAX,
      :АН => ENGLISH_SYNTAX,
      :АМ => ENGLISH_SYNTAX,
      :ЧХ => CZECH_SYNTAX,
      :ИР => IRISH_SYNTAX,
      :СИ => IRISH_SYNTAX,
      :ЛА => LATIN_SYNTAX,
      :БГ => BULGARIAN_SYNTAX,
      :УК => UKRAINIAN_SYNTAX,
      :ИТ => ITALIAN_SYNTAX,
      :АР => ARMENIAN_SYNTAX,
      :ИВ => IVERIAN_SYNTAX,
      :РМ => ROMANIAN_SYNTAX,
      :РА => OLD_ENGLISH_SYNTAX,
      :СА => MIDDLE_ENGLISH_SYNTAX,
      :ФР => FRENCH_SYNTAX,
      :ИС => SPANISH_SYNTAX,
      :НЕ => GERMAN_SYNTAX,
      :ЕВ => HEBREW_SYNTAX,
      :МСК => MSLAV_SYNTAX,
      :МСЛ => MSLAV_SYNTAX,
      :КМСК => KSLAV_SYNTAX,
      :КМСЛ => KSLAV_SYNTAX,
      # ЧИНЬ: СС, СЦ, ЦР, МК, СО, СЛ, ПО, КШ, ВЛ, НЛ, ЦУ
   }

   MATCH_TABLE = {
      :РП => "#{RUSSIAN_CAPITAL}#{RUSSIAN_STROKE}#{RUSSIAN_ACCENT}#{RUSSIAN_SYNTAX}#{SPECIFIC_SYNTAX}#{DIGITS}",
      :РУ => "#{MODIFIED_RUSSIAN_CAPITAL}#{MODIFIED_RUSSIAN_STROKE}#{MODIFIED_RUSSIAN_ACCENT}#{SPECIFIC_SYNTAX}#{MODIFIED_RUSSIAN_SYNTAX}#{DIGITS}",
      :ДР => "#{OLD_RUSSIAN_CAPITAL}#{OLD_RUSSIAN_STROKE}#{OLD_RUSSIAN_ACCENT}#{OLD_RUSSIAN_SYNTAX}",
      :ЦС => "#{CSLAV_CAPITAL}#{CSLAV_STROKE}#{CSLAV_ACCENT}#{CSLAV_SYNTAX}#{SPECIFIC_SYNTAX}",
      :СС => "#{SSLAV_CAPITAL}#{SSLAV_STROKE}#{SSLAV_ACCENT}#{SPECIFIC_SYNTAX}",
      :СР => "#{SERBIAN_CAPITAL}#{SERBIAN_STROKE}#{SERBIAN_ACCENT}#{SERBIAN_SYNTAX}#{SPECIFIC_SYNTAX}#{DIGITS}",
      :ГР => "#{GREEK_CAPITAL}#{GREEK_STROKE}#{GREEK_ACCENT}#{GREEK_SYNTAX}#{SPECIFIC_SYNTAX}#{DIGITS}",
      :СГ => "#{OLD_GREEK_CAPITAL}#{OLD_GREEK_STROKE}#{OLD_GREEK_SYNTAX}#{OLD_GREEK_ACCENT}",
      :ДГ => "#{ANCIENT_GREEK_CAPITAL}#{ANCIENT_GREEK_STROKE}#{ANCIENT_GREEK_ACCENT}#{ANCIENT_GREEK_SYNTAX}",
      :АН => "#{ENGLISH_CAPITAL}#{ENGLISH_STROKE}#{SPECIFIC_SYNTAX}#{ENGLISH_SYNTAX}#{DIGITS}",
      :АМ => "#{ENGLISH_CAPITAL}#{ENGLISH_STROKE}#{SPECIFIC_SYNTAX}#{ENGLISH_SYNTAX}#{DIGITS}",
      :ЧХ => "#{CZECH_CAPITAL}#{CZECH_STROKE}#{CZECH_ACCENT}#{CZECH_SYNTAX}#{SPECIFIC_SYNTAX}#{DIGITS}",
      :ИР => "#{IRISH_CAPITAL}#{IRISH_STROKE}#{IRISH_SYNTAX}#{SPECIFIC_SYNTAX}#{DIGITS}",
      :СИ => "#{IRISH_CAPITAL}#{IRISH_STROKE}#{IRISH_SYNTAX}#{SPECIFIC_SYNTAX}",
      :ЛА => "#{LATIN_CAPITAL}#{LATIN_STROKE}#{LATIN_SYNTAX}#{SPECIFIC_SYNTAX}",
      :БГ => "#{BULGARIAN_CAPITAL}#{BULGARIAN_STROKE}#{BULGARIAN_SYNTAX}#{SPECIFIC_SYNTAX}#{DIGITS}",
      :УК => "#{UKRAINIAN_CAPITAL}#{UKRAINIAN_STROKE}#{UKRAINIAN_SYNTAX}#{SPECIFIC_SYNTAX}#{DIGITS}",
      :ИТ => "#{ITALIAN_CAPITAL}#{ITALIAN_STROKE}#{ITALIAN_SYNTAX}#{SPECIFIC_SYNTAX}#{DIGITS}",
      :АР => "#{ARMENIAN_CAPITAL}#{ARMENIAN_STROKE}#{ARMENIAN_SYNTAX}#{SPECIFIC_SYNTAX}#{DIGITS}",
      :ИВ => "#{IVERIAN_STROKE}#{IVERIAN_SYNTAX}#{SPECIFIC_SYNTAX}#{DIGITS}",
      :РМ => "#{ROMANIAN_CAPITAL}#{ROMANIAN_STROKE}#{ROMANIAN_SYNTAX}#{SPECIFIC_SYNTAX}#{DIGITS}",
      :СА => "#{OLD_ENGLISH_CAPITAL}#{OLD_ENGLISH_STROKE}#{OLD_ENGLISH_SYNTAX}#{SPECIFIC_SYNTAX}",
      :РА => "#{MIDDLE_ENGLISH_CAPITAL}#{MIDDLE_ENGLISH_STROKE}#{MIDDLE_ENGLISH_SYNTAX}#{SPECIFIC_SYNTAX}",
      :ФР => "#{FRENCH_CAPITAL}#{FRENCH_STROKE}#{FRENCH_ACCENT}#{FRENCH_SYNTAX}#{SPECIFIC_SYNTAX}#{DIGITS}",
      :ИС => "#{SPANISH_CAPITAL}#{SPANISH_STROKE}#{SPANISH_SYNTAX}#{SPECIFIC_SYNTAX}#{DIGITS}",
      :НЕ => "#{GERMAN_CAPITAL}#{GERMAN_STROKE}#{GERMAN_SYNTAX}#{SPECIFIC_SYNTAX}#{DIGITS}",
      :ЕВ => "#{HEBREW_STROKE}#{HEBREW_ACCENT}#{HEBREW_SYNTAX}#{SPECIFIC_SYNTAX}#{DIGITS}",
      :ДЕ => "#{OLD_HEBREW_STROKE}#{OLD_HEBREW_ACCENT}",
      :АБ => "#{ARABIC_STROKE}#{SPECIFIC_SYNTAX}#{DIGITS}",
      :НО => "#{NORWEGIAN_CAPITAL}#{NORWEGIAN_STROKE}#{NORWEGIAN_ACCENT}#{SPECIFIC_SYNTAX}#{DIGITS}",
      :ДА => "#{DANISH_CAPITAL}#{DANISH_STROKE}#{DANISH_ACCENT}#{SPECIFIC_SYNTAX}#{DIGITS}",
      :ШВ => "#{SWEDISH_CAPITAL}#{SWEDISH_STROKE}#{SWEDISH_ACCENT}#{SPECIFIC_SYNTAX}#{DIGITS}",
      :ИЛ => "#{ISLAND_CAPITAL}#{ISLAND_STROKE}#{ISLAND_ACCENT}#{SPECIFIC_SYNTAX}#{DIGITS}",
      :ФА => "#{FAROESE_CAPITAL}#{FAROESE_STROKE}#{FAROESE_ACCENT}#{SPECIFIC_SYNTAX}#{DIGITS}",
      :НЗ => "#{DUTCH_CAPITAL}#{DUTCH_STROKE}#{DUTCH_ACCENT}#{SPECIFIC_SYNTAX}#{DIGITS}",
      :ПГ => "#{PORTUGUESE_CAPITAL}#{PORTUGUESE_STROKE}#{PORTUGUESE_ACCENT}#{SPECIFIC_SYNTAX}#{DIGITS}",
      :ГО => "#{GOTHIC_STROKE}#{SPECIFIC_SYNTAX}",
      :КО => "#{COPTIC_CAPITAL}#{COPTIC_STROKE}#{SPECIFIC_SYNTAX}",
      :ФИ => "#{FINNISH_CAPITAL}#{FINNISH_STROKE}#{FINNISH_ACCENT}#{SPECIFIC_SYNTAX}#{DIGITS}",
      :ЕС => "#{ESTONIAN_CAPITAL}#{ESTONIAN_STROKE}#{ESTONIAN_ACCENT}#{SPECIFIC_SYNTAX}",
      :ЛТ => "#{LATVIAN_CAPITAL}#{LATVIAN_STROKE}#{LATVIAN_ACCENT}#{SPECIFIC_SYNTAX}#{DIGITS}",
      :ЛИ => "#{LITHUANIAN_CAPITAL}#{LITHUANIAN_STROKE}#{LITHUANIAN_ACCENT}#{SPECIFIC_SYNTAX}#{DIGITS}",
      :ВН => "#{UPPER_ANCIENT_GERMANIC_CAPITAL}#{UPPER_ANCIENT_GERMANIC_STROKE}#{SPECIFIC_SYNTAX}",
      :НН => "#{LOWER_ANCIENT_GERMANIC_CAPITAL}#{LOWER_ANCIENT_GERMANIC_STROKE}#{SPECIFIC_SYNTAX}",
      :АА => "#{ARAMAIC_STROKE}#{ARAMAIC_ACCENT}#{SPECIFIC_SYNTAX}",
      #:МСК => "#{MSLAV_CAPITAL}#{MSLAV_STROKE}#{MSLAV_ACCENT}#{SPECIFIC_SYNTAX}",
      #:МСЛ => "#{MLSLAV_CAPITAL}#{MLSLAV_STROKE}#{MLSLAV_ACCENT}#{SPECIFIC_SYNTAX}",
      #:КМСК => "#{KSLAV_CAPITAL}#{KSLAV_STROKE}#{KSLAV_ACCENT}#{SPECIFIC_SYNTAX}",
      #:КМСЛ => "#{KLSLAV_CAPITAL}#{KLSLAV_STROKE}#{KLSLAV_ACCENT}#{SPECIFIC_SYNTAX}",
      # :ЦР => "#{HIP_CAPITAL}#{HIP_STROKE}#{SPECIFIC_SYNTAX}", # church hip markup
   }

   # :nodoc:
   LANGUAGE_TREE = {
      ру: %i(РП РУ),
      др: %i(ДР),
      цс: %i(ЦС РП РУ ЦР),
      сс: %i(СС ЦР),
      # мс: %i(МСК МСЛ КМСК КМСЛ),
      ан: %i(АН АМ),
      сц: :СЦ,
      ук: :УК,
      бл: :БЛ,
      мк: :МК,
      сх: %i(СР ХР),
      со: :СО,
      бг: :БГ,
      чх: :ЧХ,
      сл: :СЛ,
      по: :ПО,
      кш: :КШ,
      вл: :ВЛ,
      нл: :НЛ,
      ар: :АР,
      ив: :ИВ,
      рм: %i(РМ ЦУ ЦР),
      гр: :ГР,
      сг: :СГ,
      дг: :ДГ,
      ла: :ЛА,
      ит: :ИТ,
      фр: :ФР,
      ис: :ИС,
      не: :НЕ,
      ир: :ИР,
      си: :СИ,
      аб: :АБ,
      но: :НО,
      да: :ДА,
      са: %i(СА),
      ра: %i(РА),
      ев: :ЕВ,
      шв: :ШВ,
      ил: :ИЛ,
      фа: :ФА,
      нз: :НЗ,
      пг: :ПГ,
      го: :ГО,
      ко: :КО,
      фи: :ФИ,
      ес: :ЕС,
      лт: :ЛТ,
      ли: :ЛИ,
      вн: :ВН,
      нн: :НН,
      аа: :АА,
   }

   # :nodoc:
   ALPHABETH_TREE = LANGUAGE_TREE.reduce({}) do |res, (lang, alph_in)|
      [alph_in].flatten.reduce(res) { |r, alph| r.merge(alph => r[alph] ? r[alph] | [lang] : [lang]) }
   end

   # :nodoc:
   OPTIONS = %i(novalidate on)

   # +language_list+ returns list of available languages.
   #
   # Example:
   #
   #     validates :language_code, inclusion: { in: Languageble.language_list }
   #
   def self.language_list
      list = Languageble::LANGUAGE_TREE.keys
      list.concat( list.map( &:to_s ) )
   end

   # +alphabeth_list+ returns list of available languages.
   #
   def self.alphabeth_list
      Languageble::LANGUAGE_TREE.values.flatten.uniq
   end

   # +alphabeth_list_for+ returns list of available alphabeths for the specified
   # list of language codes as a string or and array.
   #
   # Example:
   #
   #     validates :alphabeth_code, inclusion: { in: proc { |l|
   #        Languageble.alphabeth_list_for( l.language_code ) } } ; end
   #
   def self.alphabeth_list_for language_codes
      [ language_codes ].flatten.map do |language_code|
         Languageble::LANGUAGE_TREE[ language_code.to_s.to_sym ]
      end.flatten.uniq.map( &:to_s )
   end

   # +language_list_for+ returns the language list for the specified alphabeth
   # code.
   #
   # Example:
   #
   #     validates :language_code, inclusion: { in: proc { |l|
   #        Languageble.language_list_for( l.alphabeth_code ) } } ; end
   #
   def self.language_list_for alphabeth_code
      language_codes =
      Languageble::LANGUAGE_TREE.invert.map do |(alphs, lang)|
         [ alphs ].flatten.map do |a|
            [a, lang]
         end
      end.flatten(1).reduce({}) do |h, (alph, lang)|
         case h[alph]
         when NilClass
            h[alph] = lang
         when Array
            h[alph] << lang
         else
            h[alph] = [ h[alph], lang ]
         end

         h
      end.[](alphabeth_code.to_sym)

      [ language_codes ].flatten.compact.map( &:to_s )
   end

   module ClassMethods
      def self.extended base
         base.has_one :language, primary_key: :language_code, foreign_key: :key, class_name: :Subject
         base.has_one :alphabeth, primary_key: :alphabeth_code, foreign_key: :key, class_name: :Subject
      end

      # +has_alphabeth+ sets up alphabeth feature on a column or itself model,
      # i.e. generally +alphabeth_code+, and +language_code+ fields to match text
      # of the specified columns if any.
      #
      # Examples:
      #
      #     has_alphabeth on: name: true
      #     has_alphabeth on: { text: [:nosyntax, allow: " ‑" ] }
      #     has_alphabeth on: [ :name, :text ]
      #     has_alphabeth novalidate: true
      #
      def has_alphabeth options = {}
         OPTIONS.each do |o|
            self.send( "setup_#{o}", options[ o ] )
         end
      end

      protected

      # +setup_on+ accepts options :on for validation on a specified field
      #
      # Examples:
      #
      #     has_alphabeth on: name: true
      #     has_alphabeth on: { text: [:nosyntax, allow: " ‑" ] }
      #     has_alphabeth on: [ :name, :text ]
      #
      def setup_on option_on
         on = [ option_on ].map do |o|
            case o
            when Hash
               o.map { |(k, v)| { k => v } }
            when String, Symbol
               { o => true }
            when Array
               o.map { |x| { x => true } }
            when NilClass
               []
            else
               raise "Target of kind #{o.class} is unsupported"
            end
         end.flatten.map { |x| [ x.keys.first, x.values.first ] }.to_h

         on.each do |target, options|
            self.class_eval <<-RUBY
               validates :#{target}, alphabeth: #{options.inspect}
            RUBY
         end
      end

      # +setup_novalidate+ accepts boolean option :novalidate to skip validation on
      # +:language_code+, and +:alphabeth_code+ fields.
      #
      # Examples:
      #
      #     has_alphabeth novalidate: true
      #
      def setup_novalidate novalidate
         unless novalidate
            self.class_eval <<-RUBY
               validates :language_code, inclusion: { in: Languageble.language_list }
               validates :alphabeth_code, inclusion: {
                  in: proc { |l| Languageble.alphabeth_list_for( l.language_code ) } }
               RUBY
         end
      end
   end


   def language_for locales
      language&.names&.for(locales)
   end

   def alphabeth_for locales
      alphabeth&.names&.for(locales)
   end

   class << self
      def included base
         base.extend(ClassMethods)

         base.class_eval do
            validates :language_code, inclusion: { in: Languageble.language_list }
            validates :alphabeth_code, inclusion: { in: proc { |l| Languageble.alphabeth_list_for(l.language_code)}}
         end
      end

      # detect language/alphabeth pair for the string
      def la_for_string string
         scores =
            MATCH_TABLE.map do |(alphabeth, restr)|
               #binding.pry
               [string.split(%r{[^#{restr}]+}).join, alphabeth]
            end.group_by do |(string, _alphabeth)|
               string.size
            end.sort_by do |(weight, _)|
               weight
            end

         alphabeths = scores.last.last.transpose.last
         language = alphabeths.map {|a| ALPHABETH_TREE[a] }.flatten.compact.sort_by {|l| LANGUAGE_TREE.keys.index(l) }.first
         # binding.pry

         [language, (alphabeths & [LANGUAGE_TREE[language]].flatten).first ]
      end
   end
end
