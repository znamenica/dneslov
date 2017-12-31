import { Component } from 'react'

export default class About extends Component {
   static defaultProps = {
      done: [
         'Полнотекстовый поиск по календарю',
         'Выборка памятей по дате',
         'Выборка памятей по календарю',
         'Ссылки на сторонние календари и статьи о празднике или святом',
         'Иконы праздника или святого',
         'Краткое описание праздника или подвига святого',
         'Тропари и кондаци святому или празднику',
         'Удобная выборка дат',
         'Поддержка календарей: календарь РПЦ',
         'Поддержка браузеров: Firefox, Chrome (для компьютера и android)',
         'Вводный путеводитель по календарю',
         'Адаптивная вёрстка',],
      planned: [
         'Многоязычность, поддержка языков: английский, сербский, болгарский, украинский, польский, греческий, грузинский, румынский, чешский, словацкий.',
         'Общий сводный календарь святых и праздников',
         'Автоматический уставщик',
         'Богослужение на-ряду',
         'Карта святынь с поддержкой yandex-карт',
         'API доступа к базе памятей',
         'Возможность поддержки разных иных календарей поместных православных церквей',
         'Возможность поддержки старых или современных справочников святых и праздников',
         'Возможность поддержки древних печатных календарей',],
   }

   render() {
      console.log('props', this.props)

      return (
         [<header>
            <nav className='terracota'>
               <div className="nav-wrapper about">
                  <a className='brand-logo'
                     href='/'
                     alt="Днеслов">
                     <img
                        src="dneslov-title.png" /></a></div></nav></header>,
      <main>
         <div className='container about'>
            <div className='row'>
               <div className='col s12 m12 l12 xl12'>
                  <div id='page'>
                     <table className='highlight'>
                        <tbody>
                           <tr>
                              <td><h5>Текущие особенности календаря</h5></td>
                              <td></td></tr>
                           {this.props.done.map((r) =>
                              <tr>
                                 <td>{r}</td>
                                 <td>
                                    <i
                                       className='small material-icons green'>
                                       done</i>
                                 </td>
                              </tr>)}
                           <tr>
                              <td><h5>Планирующиеся особенности календаря</h5></td>
                              <td></td></tr>
                           {this.props.planned.map((r) =>
                              <tr>
                                 <td>{r}</td>
                                 <td>
                                    <i
                                       className='small material-icons red'>
                                       edit</i>
                                 </td>
                              </tr>)}
                           <tr>
                              <td>
                                 <a href='/'>Идти к календарю</a></td>
                              <td>
                                 <a href='/'><i className='small material-icons green'>call_made</i></a></td></tr>
                        </tbody>
                     </table>
            </div></div></div></div></main>])}}
