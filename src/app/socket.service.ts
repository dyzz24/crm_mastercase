import { Injectable } from '@angular/core';
import { AuthorizationService } from './authorization.service';
import { ToastrService} from 'ngx-toastr';
import { EmailServiceService } from './email/email-service.service';
import * as io from 'socket.io-client';

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
    this.socket = io('ws://10.0.1.33:3000', {
      query: {
          // tslint:disable-next-line:max-line-length
          token: this.authorizationServ.accessToken
      }
  });
  this.socket.on('connect', () => {
    this.showSuccess(`Пользователь ${this.emailServ.idPostForHTTP} залогинен`);
    this.socketConnectedFlag = true;  // как только законектился, меняю флаг чтобы не пускать кучу запросов
});
this.socket.on('msg', (msg) => {
  const dataStr = JSON.parse(msg);
  if (dataStr.status === 1) {
    this.showSuccess(`Пользователь ${dataStr.address} взял письмо в работу`);
  this.emailServ.lettersList.map((val, ind) => {
          if (+val.id === +dataStr.mailId) {
            val.draft = dataStr.address;
          }
    });
  }
  if (dataStr.status === 0) {
  this.showSuccess(`Письмо снято`);
  this.emailServ.lettersList.map((val, ind) => {
    if (+val.id === +dataStr.mailId) {
      val.draft = null;
    }
});
  }
  if (dataStr.status === 2) {
this.showError(`Письмо УЖЕ взято в работу пользователем ${dataStr.address}`);
  }
 });

 this.socket.on('new', (newLett) => {
  const dataLetter = JSON.parse(newLett);
  this.emailServ.lettersList.unshift(dataLetter);
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
