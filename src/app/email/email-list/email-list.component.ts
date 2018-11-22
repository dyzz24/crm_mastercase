import { Component, OnInit, ElementRef, DoCheck, ViewChild} from '@angular/core';
import { Router } from '@angular/router';
import { EmailServiceService } from '../email-service.service';
import { ToastrService, ToastContainerDirective } from 'ngx-toastr';
import * as io from 'socket.io-client';



@Component({
  selector: 'app-email-list',
  templateUrl: './email-list.component.html',
  styleUrls: ['./email-list.component.scss']
})
export class EmailListComponent implements OnInit, DoCheck {
  // @ViewChild(ToastContainerDirective) toastContainer: ToastContainerDirective;   // настройка тостера
  emailItems;
  socket: SocketIOClient.Socket;


  idPost: string;
  idPostForHTTP;
  typeMessage: any;
  inboxMenuStatus = false;
  createMenuStatus = false;
  deleteMenuStatus = false;
  editMenuStatus = false;
  createSettingStatus = false;
  visibl: Array<boolean> = [false, false, false];
  inboxName;
  inboxPassword;
  inboxFullName;

  allLetters: any; // test
  messagesForFilters;
  adress;
  constructor(
    public element: ElementRef,
    private _rout: Router,
    public emailServ: EmailServiceService,
    private toastr: ToastrService
    ) {
   }

  ngOnInit() {

    // this.toastr.overlayContainer = this.toastContainer;    // настройка тостера
    // tslint:disable-next-line:max-line-length
    this.emailServ.httpPost(`${this.emailServ.ip}/user/login`, {email: 'demo@insat.ru', password: '87654321'}, {contentType: 'application/json'}).subscribe((data) => {
    this.emailServ.accessToken = data.accessToken;
    this.emailServ.httpPost(`${this.emailServ.ip}/mail/boxes`, {} ,
    {contentType: 'application/json'}).subscribe((data2) => {
      this.emailItems = data2;
    } );
    } );
  // this.socket.on('connect_error', (error) => {
  //     console.error('connect_error', error);
  // });
  // this.socket.on('error', (error) => {
  //     console.error('error', error);
  // });



    if (localStorage.length === 0) {
      this.emailServ.activeEl = [];
    }
  }
  ngDoCheck() {
    // console.log(this.emailServ.lettersList);
  }


  showHiddenBlock(param) {

    for (let j = 0 ; j < this.visibl.length; j++) {
      if (j === param) {
        continue;
      }
      this.visibl[j] = false;
    }
    this.visibl[param] = !this.visibl[param];
    this.emailServ.idLetters = [];
    this.emailServ.checkerTrash();
  }


  goUrl( index, paramsUrl, idMail, typeMess, activeNumber?, selectNum?) {
    // this.showSuccess(); // test TOSTER
    //  console.log(this.emailServ.lettersList);
    this.emailServ.haveResponse = false;
    this.adress = `${this.emailServ.ip}/mail/mails`;
    this.idPost = this.emailItems[index].address.replace('@', ''); // для вставки в URL
    this.idPostForHTTP = this.emailItems[index].address; // ID ящика
    this.emailServ.selectNum = selectNum;
    this.emailServ.idPostForHTTP = this.idPostForHTTP;
    this.emailServ.adress = this.adress;
    this.emailServ.httpPost(
    this.adress,
    // tslint:disable-next-line:max-line-length
    {address: this.idPostForHTTP, box: this.emailServ.selectNum, limit: this.emailServ.lettersAmount, offset: 0}).subscribe((data) => {
this.emailServ.haveResponse = true;
      if (data.length === 0) {
        this.emailServ.notLettersFlag = true; // индикация, что письма отсутствуют
      } else {
        this.emailServ.notLettersFlag = false;
      }
      this.emailServ.lettersList = data;
      // this.emailServ.stateServ(); // save state on service

      } );
      // this.emailServ.visibleLett(15); // TEST
      // this.emailServ.step = 15;



    this._rout.navigate(['email/' + this.idPost + paramsUrl]);
    this.emailServ.idBox = this.idPost;
    this.emailServ.typeMess = typeMess;
    this.emailServ.selectedMess = selectNum;
    this.emailServ.urlParams = `email/${this.idPost}${paramsUrl}`;

    this.emailServ.fullPath = `email/${this.idPost}${paramsUrl}`;

    if (activeNumber) {
      for (let i = 0; i < this.emailServ.activeEl.length; i++) {
        if (i === (activeNumber - 1)) {
          continue;
        }
        this.emailServ.activeEl[i] = false;
      }
    this.emailServ.activeEl[activeNumber - 1] = true;
    }
    this.emailServ.hideAvatars = [];
    this.emailServ.mailName = this.idPostForHTTP;
    this.emailServ.idLetters = [];

    this.emailServ.checkerTrash();
    this.emailServ.hiddenEmpty = false;
    this.emailServ.activeLett = [];
    this.emailServ.allLettersId = [];


    // this.emailServ.stateServ(); // save state on service

    this.emailServ.dataLetters = this.emailServ.lettersAmount; // для рестарка функции подгруза писем

    // ********************************/
  }

  deleteChangesOnService() {
    this.emailServ.deleteChangesComponents();
  }


  inboxMenuShow() {
    this.inboxMenuStatus = ! this.inboxMenuStatus;
  }
  createInboxOpen() {
    this.createMenuStatus = ! this.createMenuStatus;
  }
  deleteInboxOpen() {
    this.deleteMenuStatus = ! this.deleteMenuStatus;
  }
  settingOpen() {
    this.createSettingStatus = ! this.createSettingStatus;
  }
  closeViewer(e) {
      const checkCloser = e.target;
      if (checkCloser.classList.contains('close-new-inbox')) {
        this.createMenuStatus = ! this.createMenuStatus;
      }
      if (checkCloser.classList.contains('close-delete-inbox')) {
        this.deleteMenuStatus = ! this.deleteMenuStatus;
      }
      if (checkCloser.classList.contains('close-edit-inbox')) {
        this.editMenuStatus = ! this.editMenuStatus;
      }
      if (checkCloser.classList.contains('close-setting-inbox')) {
        this.createSettingStatus = ! this.createSettingStatus;
      }
  }

  deleteInbox(i) {
this.emailItems.splice(i, 1);
this.emailServ.lettersList = [];
this._rout.navigate(['email/']);
  }
  editInbox(i) {

    this.inboxName = this.emailItems[i].emailNames;
    this.inboxPassword = this.emailItems[i].password;
    this.inboxFullName = this.emailItems[i].fullName;

    this.createMenuStatus = false;
  this.deleteMenuStatus = false;
  this.editMenuStatus = true;
  }

loadAmount(count) {   // для количества загруженных писем
  this.emailServ.lettersAmount = count;
}
}
