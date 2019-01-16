import { Component, OnInit, DoCheck, HostListener, ViewEncapsulation, ElementRef, ViewChild, Inject, OnDestroy } from '@angular/core';
import { EmailServiceService } from '../email-service.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Observable, Subscription, UnsubscriptionError } from 'rxjs';
import { SocketService } from '../../socket.service';
import { AuthorizationService } from '../../authorization.service';
import { PreserverComponent } from '../../preserver/preserver.component';
import {NewMessageService} from '../new-message/new-message.service';


export interface SelectedLetter {
  mail_id: number;
  from_address: any;
  id: any;
  date?: number;
  work_user_id?: any;
  html?: string;
  text: string;
  subject?: string;
  details: {recipients: {
    reply_to: any;
    to: any;
    cc: any;
    bcc: any;
  },
  attachments: any};
}


@Component({
  selector: 'app-email-view',
  templateUrl: './email-view.component.html',
  styleUrls: ['./email-view.component.scss'],
  encapsulation: ViewEncapsulation.Native,
  // providers: [EmailServiceService]

})
export class EmailViewComponent implements OnInit, DoCheck, OnDestroy {
  @ViewChild('messageContainer')
  messageContainer: ElementRef;
  @ViewChild('input_cleaner')
  input_cleaner: ElementRef;
  @ViewChild(PreserverComponent)  preserver_component: PreserverComponent;
  visibleMenu = false;
  nameFrom;
  messages;
  quickResponse_active = false;
  sending_status = false;
  sub;
  selectedLetter: SelectedLetter;
  subject;
  subscription: Subscription;
  subscrioption_socket: Subscription;

  cut_addressess_array;
  cut_cc_adressess_array;
  preload_to_wait_status = true;
  attachments_array;
  id_for_request;
  index;
  cahse_letters = [];
  // subject = this.selectedLetter.subject;
  // draft = this.selectedLetter.draft;


  constructor(
    @Inject( EmailServiceService) public emailServ: EmailServiceService,
    private _rout: Router,
    private elem: ElementRef,
    private http: HttpClient,
    @Inject(AuthorizationService) private authorizationServ: AuthorizationService,
    private activatedRoute: ActivatedRoute,
    @Inject(NewMessageService) private newMessageService: NewMessageService,
    @Inject(SocketService) private socketServ: SocketService
    ) {
    }

  ngOnInit() {

    this.emailServ.hiddenEmpty = true; // скрытие "выберите письмо или нажмите написать"
        this.preload_to_wait_status = false;


        this.subscription = this.activatedRoute.params.subscribe(data => {
          this.emailServ.currentId = +data.id; // ID письма mail_id
          let flagged = true; // при каждом изменении роута
          this.cahse_letters.filter(val => {

                if (val.mail_id === this.emailServ.currentId) {
                  this.selectedLetter = val;
                  this.checkerLengthArray_bcc_cc();
                  this.checkerLength_addressess();
                  this.emailServ.activeLett[data.id] = true; // кэширование прочитанных писем в сторадж
                  this.emailServ.hiddenEmpty = true;
                  flagged = false;
                }
          });
          if (flagged) {
            this.httpPost(
      `${this.emailServ.ip}/mail/mail`,
      // tslint:disable-next-line:max-line-length
      {address: this.emailServ.idPostForHTTP, mailId: data.id}).subscribe((dataMails) => {
        // const test = this.selected_letter_part2.push(dataMails);
// console.log(dataMails);
        this.emailServ.haveResponse = true;
        this.selectedLetter = dataMails;

        this.cahse_letters.push(this.selectedLetter);


        this.checkerLengthArray_bcc_cc();
        this.checkerLength_addressess();
        this.emailServ.hiddenEmpty = true;
        });
          this.emailServ.activeLett[data.id] = true;

      }
        });



        this.subscrioption_socket = this.socketServ.data.subscribe(val => { // подписка на сокет- сервис

          if (val.status === 0) { // если письмо удалили из работы - чищу из представления
            this.selectedLetter.work_user_id = null;
          }
          if ( val.status === 4) { // если добавил я - ставлю в представление
            this.selectedLetter.work_user_id = {userId: val.userId, name: val.name};
          }
      });
              }




  checkerLengthArray_bcc_cc() {
    if (this.selectedLetter.details.recipients.cc === null || this.selectedLetter.details.recipients.cc === undefined) {
      return;
    }
      this.cut_cc_adressess_array = [];
      this.cut_cc_adressess_array = this.selectedLetter.details.recipients.cc.slice(0, 3);

  }
  checkerLength_addressess() {

      this.cut_addressess_array = [];
      this.cut_addressess_array = this.selectedLetter.details.recipients.to.slice(0, 3);

  }



  ngOnDestroy() {
if (this.subscription) {
  this.subscription.unsubscribe();
}
this.subscrioption_socket.unsubscribe();
  }
  ngDoCheck() {
    // console.log(this.selectedLetter);
  }

  public httpPost(url: string, body, options?): Observable<any> {
    return this.http.post(url, body, {headers: {Authorization: `Bearer ${this.authorizationServ.accessToken}`}});
  }

  closeViewer() {
    this.emailServ.hiddenEmpty = false;
    const navigatePath = this._rout.url.replace(/\/view.*/, '');
    this._rout.navigate([navigatePath], { relativeTo: this.activatedRoute });
  }


current_index_checker(n) {
  let current_id; // id письма
  let current_index; // его индекс в массиве писем


  this.emailServ.lettersList.filter((val, ind) => {
      if (val.mail_id === this.emailServ.currentId) {
        current_index = ind + n; // отлавливаю текущий индекс (через id url'а) + n
      }
  });


if (current_index === this.emailServ.lettersList.length) { // если элемент последний в списке
current_index = 0; // ставлю индекс в ноль
}

if (current_index < 0) { // если первый
// current_index = this.emailServ.lettersList.length - 1; // ставлю в последний индекс
return;
}

current_id =  this.emailServ.lettersList[current_index].mail_id; // получаю новое id для урла


this._rout.navigate(['../' + current_id], { relativeTo: this.activatedRoute }); // перехожу по урлу
}


  selectMess(n) {
    this.checkerLengthArray_bcc_cc();
    this.checkerLength_addressess();
    this.current_index_checker(n);

  }

  hideMenuShow() {
    this.visibleMenu = ! this.visibleMenu;
  }
  deleteLetter() { // удаление письма по клику
    const messageBody = this.messageContainer.nativeElement;
    messageBody.classList.add('dellLetter');
    const id = this.emailServ.currentId;
    this.httpPost(`${this.emailServ.ip}/mail/setbox`, {
          mailId: +id,
          boxId: 3,
          address: this.emailServ.idPostForHTTP
    }).subscribe();
    setTimeout(() => {

    this.current_index_checker(1);
    this.emailServ.lettersList = this.emailServ.lettersList.filter((val , ind) => {
      if (val.mail_id !== id) {
        return val;
      }
      });

      messageBody.classList.remove('dellLetter');

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


  deleteAdress(index) {
    this.emailServ.mailsToArray = this.emailServ.mailsToArray.filter((val, ind, self) => {
        if (ind !== index) {
          return val;
        }
    });
  }


  all_view(e) {
    if (e.target.classList.contains('cc')) {
      if (this.cut_cc_adressess_array !== this.selectedLetter.details.recipients.cc) {
      this.cut_cc_adressess_array = this.selectedLetter.details.recipients.cc;
      e.target.value = '';
      e.target.classList.add('input_return');
      } else {
        e.target.classList.remove('input_return');
        this.checkerLengthArray_bcc_cc();
        e.target.value = this.selectedLetter.details.recipients.cc.length - this.cut_cc_adressess_array.length;
      }
    }
    if (e.target.classList.contains('addressess')) {
      if (this.cut_addressess_array !== this.selectedLetter.details.recipients.to) {
      this.cut_addressess_array = this.selectedLetter.details.recipients.to;
      e.target.value = '';
      e.target.classList.add('input_return');
      } else {
        e.target.classList.remove('input_return');
        this.checkerLength_addressess();
        e.target.value = this.selectedLetter.details.recipients.to.length - this.cut_addressess_array.length;
      }
    }
  }

  show_quick_form(cancelFlag) {
    if (cancelFlag === false) { // если передан отрицательный флаг
    this.quickResponse_active = true;  // активирую стили для показа быстрой формы
    this.nameFrom = this.selectedLetter.from_address; // подставляю в переменные значения с активного письма
    this.subject = this.selectedLetter.subject;


    } else {
      this.quickResponse_active = false; // если передан отрицательный флаг, всё прячу
    }
  }
  quick_send() {
    const formData = new FormData;
    formData.append('json', JSON.stringify({
      from: [
        {address: this.emailServ.idPostForHTTP}
      ],
      to: [
        {
          address: this.nameFrom
        }
      ],
      subject: this.subject,
      text: this.messages
    }));

    this.httpPost(`${this.emailServ.ip}/mail/send`, formData).subscribe(resp => {
  });

    this.sending_status = true;
    setTimeout(() => {
      this.sending_status = false;
      this.quickResponse_active = false;
      this.nameFrom = ''; // очищаю:  имя,
      this.subject = ''; // тему,
      this.messages = ''; // тело пиьма,
      this.input_cleaner.nativeElement.value = ''; // инпут
    }, 2000);

  }

  print() {
    window.print();
}

preserv_saver() {
  this.preserver_component.save_bookmark();
}


onFileChange(event) {
  const files  = event.target.files; // отловил файлы прикрепления
  if (files.length > 0) {
    this.newMessageService.files = files;
    this.emailServ.hiddenEmpty = true;
    this._rout.navigate(['./create', { 'files': true, id: this.emailServ.currentId}], { relativeTo: this.activatedRoute});
  }

}

gownload_attach(e, attach) {

  this.httpDownload(`${this.emailServ.ip}/mail/download`, {
    hashes: [{'hash' : attach.hash, 'name': attach.name}],
    zip: false
}).subscribe(data => {
const downloadLink = document.createElement('a');
            downloadLink.href = window.URL.createObjectURL(data);
            downloadLink.download = attach.name;
            downloadLink.click();
});
}

download_all_attach(attach) {
  const hashes = attach.map(val => { // собираю hash из массива c вложениями
      return {'hash': val.hash, 'name': val.name };
  });
  this.httpDownload(`${this.emailServ.ip}/mail/download`, {
    hashes: hashes,
    zip: true
}).subscribe(data => {
const downloadLink = document.createElement('a');
            downloadLink.href = window.URL.createObjectURL(data);
            downloadLink.download = 'files.zip';
            downloadLink.click();
});

}

public httpDownload(url: string, body, options?): Observable<any> {

  return this.http.post(url, body, {headers: {
    Authorization: `Bearer ${this.authorizationServ.accessToken}`,
    }, responseType: 'blob' as 'json'});
}

}
