import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'attachPipe'
})
export class AttachPipePipe implements PipeTransform {

  constructor() {}

  transform(item): any {

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
