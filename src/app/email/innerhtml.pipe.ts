import { Pipe, PipeTransform } from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

@Pipe({
  name: 'innerhtml'
})
export class InnerhtmlPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {}

  transform(html): any {
    return this.sanitizer.bypassSecurityTrustHtml(html);

  }

}

@Pipe({
  name: 'innerTextPipe'
})
export class InnerTextPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {}

  transform(html): any {
   const pageHtml = html.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style|<.*?>|>/g, '');


    // tslint:disable-next-line:max-line-length
    // return page.replace(/[a-zA-Z\;\:\{\}\@\"\(\)\d\-\'\,\/\%\.\!\[\]\#\*\&\<\>\=\|\_\+\•\?\’]|<.*?>/g, '');
  const page = this.sanitizer.bypassSecurityTrustHtml(pageHtml);
    return page;
  }
}

@Pipe({
  name: 'timerPipe'
})
export class TimerPipe implements PipeTransform {

  constructor() {}

  transform(item, compactDateSearch?): any {
    const date = new Date(item);
    date.setHours(date.getHours() - 3);
    const nowDate = new Date();
    const difference = +nowDate - +date;
    if (difference < 86400000) {
      return `${date.getHours()}:${date.getMinutes()}`;
    }
    if (difference > 86400000 && difference < 172800000) {
      return `Вчера ${date.getHours()}:${date.getMinutes()}`;
    }
    if (difference > 172800000 && difference < 604800000) {
      const days = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];
      const weekDays = days[date.getDay()];
      return `${weekDays} ${date.getHours()}:${date.getMinutes()}`;
    }
    if (difference > 604800000 ) {
      const month = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
      const months = month[date.getMonth()];
      if (compactDateSearch) {
        return `${date.getDate()} ${months}`;
      } else {
      return `${date.getDate()}.${months} ${date.getHours()}:${date.getMinutes()}`;
      }
    }
    if (difference > 31556926000) {
      const month = ['Янв', 'Фев', 'Март', 'Апр', 'Май', 'Июнь', 'Июль', 'Авг', 'Сент', 'Окт', 'Ноя', 'Дек'];
      const months = month[date.getMonth()];
        return `${date.getFullYear()} ${months}`;
    }
  }
}

@Pipe({
  name: 'attachPipe'
})
export class AttachPipe implements PipeTransform {

  constructor() {}

  transform(item): any {
    // if (item === 'xls') {
    // return 'la exc';
    // }
    // if (item === 'pdf') {
    //   return 'la pdf';
    //   }
    //   if (item === 'jpg') {
    //     return 'la img';
    //     }
    //     if (item === 'doc') {
    //       return 'la doc';
    //       }
    //       if (item === 'txt') {
    //         return 'la txt';
    //         }
    switch (item) {
      case 'xls':
      return 'la exc';
      case 'pdf':
      return 'la pdf';
      case 'jpg':
      case 'png':
      return 'la img';
      case 'doc':
      return 'la doc';
      case 'txt':
      return 'la txt';
      case 'mp3':
      return 'la mp3';
    }
  }
}


@Pipe({
  name: 'checkedPipe'
})
export class CheckedPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {}

  transform(html): any {
    return html;
  }
}

