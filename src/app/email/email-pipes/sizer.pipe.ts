import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sizer'
})
export class SizerPipe implements PipeTransform {

  transform(value: any, args?: any): any {

    const sizer = value + '';
    if  (sizer.length < 4) {
      return value + 'B';
    }
    if  (sizer.length === 4) {
      return `${value}`.substr(0, 1) + 'Kb';
    }
    if  (sizer.length === 5) {
      return `${value}`.substr(0, 2) + 'Kb';
    }
    if  (sizer.length === 6) {
      return `${value}`.substr(0, 3) + 'Kb';
    }
    if (sizer.length === 7) {
        return `${value}`.substr(0, 1) + 'Mb';
    }
    if (sizer.length > 7) {
      return `${value}`.substr(0, 2) + 'Mb';
    }
  }

}
