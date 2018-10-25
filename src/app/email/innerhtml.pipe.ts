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
   const page = html;


    // tslint:disable-next-line:max-line-length
    return page.replace(/[a-zA-Z\;\:\{\}\@\"\(\)\d\-\'\,\/\%\.\!\[\]\#\*\&\<\>\=\|\_\+\•\?\’]|<.*?>/g, '');
  // const page = this.sanitizer.bypassSecurityTrustHtml(html);
  //   return page;
  }


}
