import { Injectable } from '@angular/core';
import { AuthorizationService } from './authorization.service';
import { ToastrService} from 'ngx-toastr';
import { EmailServiceService } from './email/email-service.service';
import * as io from 'socket.io-client';
import {global_params} from './global';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: SocketIOClient.Socket;
  private socketConnectedFlag = false;
  public data = new Subject<any>();

  constructor(private authorizationServ: AuthorizationService,
    private toastrServ: ToastrService,
    private emailServ: EmailServiceService) { }

    change_params_in_work(param) {
        this.data.next(param); // отправляю событие для email-view компонента для отображения кем взято в работу
    }

  lettersSocketConnect() {
    if (this.socketConnectedFlag === true) { // если уже был коннект, выхожу
      return;
    } else {
    this.socket = io(global_params.socket_ip, {
      query: {
          // tslint:disable-next-line:max-line-length
          token: this.authorizationServ.accessToken
      }
  });
  this.socket.on('connect', () => {
    this.showSuccess(`Пользователь  залогинен`);
    this.socketConnectedFlag = true;  // как только законектился, меняю флаг чтобы не пускать кучу запросов
});
this.socket.on('mail/envelope/update', (msg) => {
  const dataStr = JSON.parse(msg);

  dataStr.forEach(el => {
    console.log(el);

  if (el.status === 4) {
    this.showSuccess(`Пользователь ${el.become.name} взял письмо в работу`);
    this.emailServ.lettersList.map((val, ind) => {
      if (+val.mail_id === +el.mailId) {
          val.work_user_id = {
          email: el.become.email,
          // firstName: el.firstName,
          name: el.become.name,
          userId: el.userId};
      }
  });
  this.change_params_in_work(el);
  }
  if (el.status === 0) {
    this.showSuccess(`Пользователь  удалил письмо из работы`);
    this.emailServ.lettersList.map((val, ind) => {
      if (+val.mail_id === +el.mailId) {
        val.work_user_id = null;
      }
  });

  this.change_params_in_work(el);

  }
  if (el.status === 2) {
this.showError(`Письмо УЖЕ взято в работу пользователем ${el.been.name}`);
  }
 });
});
 this.socket.on('mail/sync', (newLett) => {
  const dataLetter = JSON.parse(newLett);
  console.log(dataLetter);
  dataLetter.map(val => {
    this.emailServ.lettersList.unshift(val);
  });
  // this.emailServ.lettersList.unshift(dataLetter);
 });
}
   // this.socket.on('connect_error', (error) => {
  //     console.error('connect_error', error);
  // });
  // this.socket.on('error', (error) => {
  //     console.error('error', error);
  // });

    // if (localStorage.length === 0) {
    //   this.emailServ.activeEl = [];
    // }
  }
  showSuccess(param) {
    this.toastrServ.success(param);
  }
  showError(param) {
    this.toastrServ.error(param);
  }
}
