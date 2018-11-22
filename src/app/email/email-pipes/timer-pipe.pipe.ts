import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timerPipe'
})

export class TimerPipePipe implements PipeTransform {

  constructor() {}

  transform(item, compactDateSearch?): any {
    const date = new Date(item);
    date.setHours(date.getHours());
    const nowDate = new Date();
    const difference = +nowDate - +date;
    const minuts = ('0' + date.getMinutes()).slice(-2);
    if (difference < 86400000) {
      return `${date.getHours()}:${minuts}`;
    }
    if (difference > 86400000 && difference < 172800000) {
      return `Вчера ${date.getHours()}:${minuts}`;
    }
    if (difference > 172800000 && difference < 604800000) {
      const days = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];
      const weekDays = days[date.getDay()];
      return `${weekDays} ${date.getHours()}:${minuts}`;
    }
    if (difference > 604800000 ) {
      const month = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
      const months = month[date.getMonth()];
      if (compactDateSearch) {
        return `${date.getDate()} ${months}`;
      } else {
      return `${date.getDate()}.${months} ${date.getHours()}:${minuts}`;
      }
    }
    if (difference > 31556926000) {
      const month = ['Янв', 'Фев', 'Март', 'Апр', 'Май', 'Июнь', 'Июль', 'Авг', 'Сент', 'Окт', 'Ноя', 'Дек'];
      const months = month[date.getMonth()];
        return `${date.getFullYear()} ${months}`;
    }
  }
}
