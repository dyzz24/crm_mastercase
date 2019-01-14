import { Injectable } from '@angular/core';
import { AuthorizationService } from './authorization.service';
import { ToastrService} from 'ngx-toastr';
import { EmailServiceService } from './email/email-service.service';
import * as io from 'socket.io-client';
import {global_params} from './global';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: SocketIOClient.Socket;
  private socketConnectedFlag = false;

  constructor(private authorizationServ: AuthorizationService,
    private toastrServ: ToastrService,
    private emailServ: EmailServiceService) { }

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
this.socket.on('mail/work', (msg) => {
  const dataStr = JSON.parse(msg);
  console.log(dataStr);
  if (dataStr.status === 4) {
    this.showSuccess(`Пользователь ${dataStr.firstName} ${dataStr.lastName}  взял письмо в работу`);
    this.emailServ.lettersList.map((val, ind) => {
      if (+val.mail_id === +dataStr.mailId) {
          val.work_user_id = {
          email: dataStr.email,
          firstName: dataStr.firstName,
          lastName: dataStr.lastName,
          userId: dataStr.userId};
      }
  });
  }
  if (dataStr.status === 0) {
    this.showSuccess(`Пользователь  удалил письмо из работы`);
    this.emailServ.lettersList.map((val, ind) => {
      if (+val.mail_id === +dataStr.mailId) {
        val.work_user_id = null;
      }
  });

  }
  if (dataStr.status === 2) {
this.showError(`Письмо УЖЕ взято в работу пользователем ${dataStr.firstName} ${dataStr.lastName}`);
  }
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
