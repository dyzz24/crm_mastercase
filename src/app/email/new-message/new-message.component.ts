import { Component, OnInit, Input, DoCheck, Inject } from '@angular/core';
import { EmailServiceService } from '../email-service.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthorizationService } from '../../authorization.service';


@Component({
  selector: 'app-new-message',
  templateUrl: './new-message.component.html',
  styleUrls: ['./new-message.component.scss']
})
export class NewMessageComponent implements OnInit, DoCheck {
  constructor(
    @Inject(EmailServiceService) public emailServ: EmailServiceService,
    private _rout: Router,
    private http: HttpClient,
    @Inject(AuthorizationService) private authorizationServ: AuthorizationService) { }

private from;
private to = [this.emailServ.to_answer]; // array for send
private copy = [this.emailServ.to_all_answer]; // array for send
private hidden_copy = []; // array for send
private subject = this.emailServ.to_subject; // тема для отправки

private messages;

  ngOnInit() {
    // console.log(this.copy)
  }
  ngDoCheck() {
    // console.log(this.to);
  }

  public httpPost(url: string, body, options?): Observable<any> {
    return this.http.post(url, body, {headers: {Authorization: `Bearer ${this.authorizationServ.accessToken}`}});
  }

  add_data(arr, e) { // срабатывает по блюру, функция принимает массив для работы
      if (e.target.value === undefined || e.target.value === '') { // если пустая строка - выхожу
        return;
      }
      if (arr[0] === '') { // если первый элемент  = ""
                          // (такое бывает, когда нажимаю создать новое письмо, ибо передает '' от сервиса), удаляю его
          arr.shift();
      }
      arr.push(e.target.value); // добавляю в массив значение с таргета
      e.target.value = ''; // чищу значение с таргета
  }
  add_data_keyEvent(arr,  e) { // срабатывает при клике на Enter, функция принимает массив для работы
    if (e.key === 'Enter' && e.target.value !== '') { // отлавливаю клик на Enter
      if (arr[0] === '') { // аналогично действию в блюре
        arr.shift();
      }
      arr.push(e.target.value);
      e.target.value = '';
    }
  }



  closeViewer() {
    this.emailServ.hiddenEmpty = false;
    this._rout.navigate([this.emailServ.urlParams]);
    this.emailServ.fullPath = this.emailServ.urlParams;
    // this.emailServ.stateServ();
  }

  sendMessage() {
    this.httpPost(
      `${this.emailServ.ip}/mail/send`,
      // tslint:disable-next-line:max-line-length
      { subject: this.subject, text: this.messages, html: this.messages, to: this.to}).subscribe((data) => {
  });

}}
