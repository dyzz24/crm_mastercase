import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'attachPipe'
})
export class AttachPipePipe implements PipeTransform {

  constructor() {}

  transform(item): any {

    switch (item.toLowerCase().substr(item.lastIndexOf('.') + 1)) {
      case 'p7s':
      return 'la la-file-o';
      case 'xls':
      return 'la la-file-excel-o';
      case 'pdf':
      return 'la la-file-pdf-o';
      case 'jpg':
      case 'png':
      return 'la la-image';
      case 'doc':
      case 'docx':
      return 'la la-file-word-o';
      case 'txt':
      return 'la la-file-text-o';
      case 'mp3':
      return 'la la-file-audio-o';
      case 'zip':
      case 'rar':
      return 'la la-file-archive-o';
      case 'ppt':
      return 'la la-file-powerpoint-o';
      default:
      return 'la la-file-o';
    }
  }

}
