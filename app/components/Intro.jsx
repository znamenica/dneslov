import { Component } from 'react'
import { Steps, Hints } from 'intro.js-react'
import * as introJs from 'intro.js'
import { withCookies, Cookies } from 'react-cookie'

export class Intro extends Component {
   static defaultProps = {
      enabled: false,
      steps: [
         {
            element: '.brand-logo',
            intro: 'Добро пожаловать на сайт православного календаря «Днесловъ». Пройдитесь по введению пошагово. На любом шаге вы можете его остановить.',
            position: 'auto',
            datestamp: '20171213185700',
         },
         {
            element: '.calendary',
            intro: 'Здесь на панельке календаря вы можете выбрать день, за который вам будут показаны памяти великих праздников, святых, чтимых икон Спасителя или Богородицы.',
            position: 'right',
            datestamp: '20171213185700',
         },
         {
            element: '.calendary nav#calendar-styles',
            intro: 'Кнопки управления стилем календаря позволяют выбрать один из двух предложенных церковных стилей - юлианский и новоюлианский. По-умолчанию используется юлианский стиль.',
            position: 'right',
            datestamp: '20171213185700',
         },
         {
            element: '.calendary nav:nth-child(2)',
            intro: 'Панель выбора текущего месяца и года даёт возможность задать год и/или месяц для календарной сетки. Сетка выбора появляется после нажатия на имя месяца, нажатие же на стрелку «►» меняет месяц на следующий, а «◄» на предыдущий. По-умолчанию выбран текущий месяц избранного стиля',
            position: 'right',
            datestamp: '20171213185700',
         },
         {
            element: '.calendary .pmu-instance > .pmu-days',
            intro: 'В календарной сетке дней избранного месяца отображаются дни выбранного месяца, дни которого начерчены чёрным цветом, серым же цветом начерчены дни соседних месяцев.',
            position: 'right',
            datestamp: '20171213185700',
         },
         {
            element: '.calendary .pmu-instance > .pmu-days .pmu-button:first-child',
            intro: 'В поле дня для юлианского календаря, дата вверху означает юлианскую дату, а под ней новоюлианскую. Для новоюлианского календаря показывается только новоюлианская дата.',
            position: 'right',
            datestamp: '20200418000400',
         },
         {
            element: '.calendary .pmu-instance .pmu-days .pmu-today',
            intro: 'Кружком светлобирюзового цвета выделен нынешний день. Нынешний день начинается в 16:00 по местному времени',
            position: 'right',
            datestamp: '20171213185700',
         },
         {
            element: '.calendary .pmu-instance .pmu-days .pmu-selected',
            intro: 'Кружком небесного выделен избранный день, памяти которого будет показаны в списке. По-умолчанию день избирается автоматически. В 15 часов местного времени дня автоматическая выборка переключается на следующий день.',
            position: 'right',
            datestamp: '20171213185700',
         },
         {
            element: '.calendary .pmu-instance .pmu-days .pmu-today.pmu-selected',
            intro: 'Кружком светлобирюзового цвета с насыщенною каймою, представляет случай, если нынеший и избранный дни совпадают.',
            position: 'right',
            datestamp: '20171213185700',
         },
         {
            element: '.calendary .next-prev',
            intro: 'Панель выбора текущего дня позволит сменить день на следующий или предыдущий от текущего избранного. Нажатие на стрелку «◄» с надписью «Вчера», меняет день на предыдущий день (не обязательно нынешнего), а на стрелку «►» с надписью «Завтра» - следующий день.',
            position: 'right',
            datestamp: '20171213185700',
         },
         {
            element: '#search-field',
            intro: 'Строка поиска позволяет вам искать памяти святых, икон или предметов по имени или описанию. Поисковая строка может разделяться пробелами и знаками «/». Если слова разделены знаками «/», то при поиск будут выбираться памяти, в описании или имени которых будет упоминаться ЛЮБОЕ из слов, если слова разделены пробелами, то памяти, с упоминанием ВСЕХ слов записанных через пробел, но в любом порядке.',
            position: 'top',
            datestamp: '20171213185700',
         },
         {
            element: '#calendaries-cloud',
            intro: 'Облако календарей содержит плашки со всеми доступными для выборки календарями, при нажатии на знака «+» напротив имени календаря, будет произведён новый поиск памятей с дополнительным условием выборки, а именно выбираться памяти будут дополнительно также и из выбранного календаря. Если «плюс» отсутствует, в этом случае календарь уже выбран как условие поиска.',
            position: 'right',
            datestamp: '20171213185700',
         },
         {
            element: '#search-conditions',
            intro: 'Выборка показывает условия, по которым был проведён поиск памятей. Условия могут включать: дату поиска, задающую выбор памятей, события которых удовлетворяют выбранной дате, также наименования календарей, которых может быть несколько, и тогда памяти будут включены из нескольких избранных календарей сразу, а ещё включать слова из строки поиска. Каждое из условий выборки можно убрать нажав на «крестик» в плашке напротив текста сего условия.',
            position: 'bottom',
            datestamp: '20171213185700',
         },
         {
            element: '#memories-list',
            intro: 'Список памятей, избранных согласно текущей выборке, представляет собою вертикальный перечень «досточек».',
            position: 'top',
            datestamp: '20171213185700',
         },
         {
            element: '#memories-list .collection-item:nth-child(1) .collapsible-header',
            intro: 'Каждая из «досточек» содержит малый образок, чин памяти, краткое имя и основную дату данной памяти. При нажатии на «досточку» под ней появится блок с кратким описанием сей памяти.',
            position: 'top',
            datestamp: '20171213185700',
         },
         {
            element: '#memories-list .collection-item:nth-child(1) img, #memories-list .collection-item:nth-child(1) i',
            intro: 'Образок является маленькою иконою святого или события, связанного с памятью. При нажатии на образок будет загружена страница с подробным описанием памяти. В случае отсутствующего образка показывается картинка по-умолчанию.',
            position: 'left',
            datestamp: '20171213185700',
         },
         {
            element: '#memories-list .collection-item:nth-child(1) .chip',
            intro: 'Плашка с чином содержит краткую строку, поясняющую вид памяти, напр. «свт», «прав», «обр», и т.п.',
            position: 'right',
            datestamp: '20171213185700',
         },
         {
            element: '.run-intro',
            intro: 'Если вам что-либо будет нужно напомнить просто нажмите кнопку сию, и введение запустится ещё раз.',
            position: 'left',
            datestamp: '20171213185700',
         },
      ],
   }

   state = {
      enabled: this.isRunRequired(),
      introLetterDate: this.calculateLatterStepDateStamp(this.props)
   }

   // system
   componentDidMount() {
      if (this.state.enabled) {
         this.setLatterStepDateStamp()
      }
   }

   // custom
   isRunRequired() {
      return this.calculateLatterStepDateStamp(this.props) > this.getLatterStepDateStamp()
   }

   getLatterStepDateStamp() {
      const { cookies } = this.props

      return cookies.get('introDatestamp') || '0'
   }

   setLatterStepDateStamp() {
      const { cookies } = this.props

      console.log( "save", this.state.introLetterDate )
      cookies.set('introDatestamp', this.state.introLetterDate)
   }

   calculateLatterStepDateStamp(props = this.props) {
      const { steps } = props,
            { cookies } = props

      return steps.reduce((datestamp, step) => {
         return step.datestamp < datestamp && datestamp || step.datestamp
      }, '0')
   }

   // events
   handleNameChange(name) {
      const { cookies } = this.props
 
      this.setState({ name })
   }

   onRunIntroClick() {
      this.setState({ enabled: true })
      this.setLatterStepDateStamp()
   }

   onExitIntro() {
      this.setState({ enabled: false })
   }

   render() {
      return (
         <div className="fixed-action-btn">
            <Steps
               enabled={this.state.enabled}
               steps={this.props.steps}
               initialStep={0}
               options = {{
                  nextLabel: 'Далее &rarr;',
                  prevLabel: '&larr; Ранее',
                  skipLabel: 'Пропусти',
                  doneLabel: 'За работу!',
                  scrollToElement: true,
                  hidePrev: true,
                  hideNext: true,
                  exitOnOverlayClick: false,
                  exitOnEsc: true,
                  scrollTo: 'tooltip',
                  tooltipPosition: 'auto',
                  positionPrecedence: ["bottom", "right", "left", "top"],
                  hintButtonLabel: 'Ясно!',
               }}
               onExit={this.onExitIntro.bind(this)}
            />
            <a
               className="run-intro btn-floating btn-large waves-effect waves-light terracota"
               onClick={this.onRunIntroClick.bind(this)}>
               <i className="material-icons">account_balance_wallet</i></a>
</div>)}}

export default withCookies(Intro)
