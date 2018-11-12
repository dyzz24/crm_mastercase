import { Pipe, PipeTransform } from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';

@Pipe({
  name: 'innerTextPipe'
})
export class InnerTextPipe implements PipeTransform {

  constructor(private sanitizer: DomSanitizer) {}

  transform(html): any {
   const pageHtml = html.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style|<.*?>|>/g, '');
  const page = this.sanitizer.bypassSecurityTrustHtml(pageHtml);
    return page;
  }
}
