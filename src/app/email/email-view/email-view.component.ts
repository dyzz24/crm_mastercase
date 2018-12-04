import { Component, OnInit, DoCheck, HostListener, ViewEncapsulation, ElementRef, ViewChild, Inject } from '@angular/core';
import { EmailServiceService } from '../email-service.service';
import { Router, ActivatedRoute } from '@angular/router';
import { attachers } from './attach';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SocketService } from '../../socket.service';
import { AuthorizationService } from '../../authorization.service';



@Component({
  selector: 'app-email-view',
  templateUrl: './email-view.component.html',
  styleUrls: ['./email-view.component.scss'],
  encapsulation: ViewEncapsulation.Native,
  providers: [EmailServiceService]
})
export class EmailViewComponent implements OnInit, DoCheck {
  @ViewChild('messageContainer')
  messageContainer: ElementRef;
  @ViewChild('input_cleaner')
  input_cleaner: ElementRef;
  visibleMenu = false;
  nameFrom;
  subject;
  messages;
  attachersList = attachers;
  quickResponse_active = false;
  sending_status = false;
  sub;


  constructor(public emailServ: EmailServiceService,
    private _rout: Router,
    private elem: ElementRef,
    private http: HttpClient,
    @Inject(AuthorizationService) private authorizationServ: AuthorizationService,
    private activatedRoute: ActivatedRoute
    ) { }

  ngOnInit() {

    this.activatedRoute.params.subscribe(params => this.sub = params.id);
    const requestInterval = setInterval(() => {
      if (this.emailServ.lettersList !== undefined) {
        clearInterval(requestInterval); // если токен не пришел, продолжает опрашивать сервис авторизации (потом убрать)
        this.emailServ.selectedLetter = this.emailServ.lettersList[this.sub];
        this.emailServ.hiddenEmpty = true;
      }
    }, 1000);
  }
  ngDoCheck() {
    // console.log(this.subject, this.nameFrom, this.messages);
  }

  public httpPost(url: string, body, options?): Observable<any> {
    return this.http.post(url, body, {headers: {Authorization: `Bearer ${this.authorizationServ.accessToken}`}});
  }

  closeViewer() {
    this._rout.navigate([this.emailServ.urlParams]);
    this.emailServ.hiddenEmpty = false;
    this.emailServ.fullPath = this.emailServ.urlParams;
    // this.emailServ.stateServ();
  }


  selectMess(n) {

    this.emailServ.checkerLengthArray_bcc_cc();
    this.emailServ.checkerLength_addressess();

this.emailServ.index = this.emailServ.index + n;
if (this.emailServ.index === this.emailServ.lettersList.length) {
  this.emailServ.index = 0;
}

if (this.emailServ.index < 0) {
  this.emailServ.index = this.emailServ.lettersList.length - 1;
}

for (let i = 0; i < this.emailServ.activeLett.length; i++) {
this.emailServ.activeLett[i] = false;
}

this.emailServ.activeLett[this.emailServ.index] = true;
this.emailServ.selectedLetter = this.emailServ.lettersList[this.emailServ.index];  // текущее письмо для отображения!!!!
this.emailServ.currentId = this.emailServ.index;

this._rout.navigate([this.emailServ.urlParams + '/view' + '/' + this.emailServ.index]);

  }

  hideMenuShow() {
    this.visibleMenu = ! this.visibleMenu;
  }
  deleteLetter() { // удаление письма по клику
    const messageBody = this.messageContainer.nativeElement;
    messageBody.classList.add('dellLetter');
    const id = this.emailServ.selectedLetter;
    this.httpPost(`${this.emailServ.ip}/mail/setbox`, {id : +id.id, box: 2}).subscribe();
    setTimeout(() => {
      for (let i = 0; i < this.emailServ.lettersList.length; i++) {
        if (this.emailServ.lettersList[i].id === id.id) {
          this.emailServ.selectedLetter = this.emailServ.lettersList[i + 1];
          this.emailServ.index = i;
        }
    }

    this.emailServ.lettersList = this.emailServ.lettersList.filter((val , ind) => {
      if (val !== id) {
        return val;
      }
      });
      messageBody.classList.remove('dellLetter');
      // this.emailServ.stateServ();
    }, 500);
  }

  @HostListener('document:keydown', ['$event'])
  public KeyEvent(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown') {
      this.selectMess(1);
    }
    if (event.key === 'ArrowUp') {
      this.selectMess(-1);
    }
    if (event.key === 'Delete') {
      this.deleteLetter();
    }
    event.stopPropagation();
  }

  // addFrom() {
  //   const validate = /^[\w\.\d-_]+@[\w\.\d-_]+\.\w{2,4}$/i;
  //   if (this.nameFrom !== '' && validateAdress(this.nameFrom) !== -1) {
  //   this.emailServ.mailsToArray.push(this.nameFrom);
  //   this.emailServ.mailsToArray = this.emailServ.mailsToArray.filter((val, ind, self) => {
  //     return self.indexOf(val) === ind;
  //   });
  //   this.nameFrom = '';
  // } else {
  //   alert('Введите корректный имейл');
  // }
  // function validateAdress(val) {
  //   return String(val).search(validate);
  // }
  // }

  deleteAdress(index) {
    this.emailServ.mailsToArray = this.emailServ.mailsToArray.filter((val, ind, self) => {
        if (ind !== index) {
          return val;
        }
    });
  }


  all_view(e) {
    if (e.target.classList.contains('cc')) {
      if (this.emailServ.cut_cc_adressess_array !== this.emailServ.selectedLetter.cc_addresses) {
      this.emailServ.cut_cc_adressess_array = this.emailServ.selectedLetter.cc_addresses;
      e.target.value = '';
      e.target.classList.add('input_return');
      } else {
        e.target.classList.remove('input_return');
        this.emailServ.checkerLengthArray_bcc_cc();
        e.target.value = this.emailServ.selectedLetter.cc_addresses.length - this.emailServ.cut_cc_adressess_array.length;
      }
    }
    if (e.target.classList.contains('addressess')) {
      if (this.emailServ.cut_addressess_array !== this.emailServ.selectedLetter.to_addresses) {
      this.emailServ.cut_addressess_array = this.emailServ.selectedLetter.to_addresses;
      e.target.value = '';
      e.target.classList.add('input_return');
      } else {
        e.target.classList.remove('input_return');
        this.emailServ.checkerLength_addressess();
        e.target.value = this.emailServ.selectedLetter.to_addresses.length - this.emailServ.cut_addressess_array.length;
      }
    }
  }

  show_quick_form(cancelFlag) {
    if (cancelFlag === false) { // если передан отрицательный флаг
    this.quickResponse_active = true;  // активирую стили для показа быстрой формы
    this.nameFrom = this.emailServ.selectedLetter.from_address; // подставляю в переменные значения с активного письма
    this.subject = this.emailServ.selectedLetter.subject;

    } else {
      this.quickResponse_active = false; // если передан отрицательный флаг, всё прячу
    }
  }
  quick_send() {
    this.sending_status = true;
    setTimeout(() => {
      this.sending_status = false;
      this.quickResponse_active = false;
      this.nameFrom = ''; // очищаю:  имя,
      this.subject = ''; // тему,
      this.messages = ''; // тело пиьма,
      this.input_cleaner.nativeElement.value = ''; // инпут
    }, 2000);
  //   this.httpPost(
  //     `${this.emailServ.ip}/mail/send`,
  //     // tslint:disable-next-line:max-line-length
  //     { subject: this.subject, text: this.messages, html: this.messages, to: this.nameFrom}).subscribe((data) => {
  // });
  }

  print() {
    window.print();
}

}
