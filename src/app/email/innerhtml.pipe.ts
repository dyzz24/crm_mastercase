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
   const page = this.sanitizer.bypassSecurityTrustHtml(html).toString();


    // tslint:disable-next-line:max-line-length
    return page.replace(/[\{.*?-\}.*?]|SafeValue must use \[property\]=binding:|<.*?>/g, '');
  // const page = this.sanitizer.bypassSecurityTrustHtml(html);
  //   return page;
  }


}
