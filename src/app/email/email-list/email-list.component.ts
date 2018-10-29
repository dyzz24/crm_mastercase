import { Component, OnInit, ElementRef, DoCheck} from '@angular/core';
import { Router } from '@angular/router';
import { EmailServiceService } from '../email-service.service';


import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-email-list',
  templateUrl: './email-list.component.html',
  styleUrls: ['./email-list.component.scss']
})
export class EmailListComponent implements OnInit, DoCheck {
  emailItems;


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

  constructor(
    public element: ElementRef,
    private _rout: Router,
    public emailServ: EmailServiceService,
    private http: HttpClient
    ) {
   }

  ngOnInit() {
    // tslint:disable-next-line:max-line-length
    this.emailServ.httpPost('http://10.0.1.33:3000/user/login', {email: 'seo@insat.ru', password: '12345678'}).subscribe((data) => {
    this.emailServ.accessToken = data.accessToken;
    this.emailServ.httpPost('http://10.0.1.33:3000/mail/boxes', {}).subscribe((data2) => this.emailItems = data2 );
    this.emailServ.stateServ(); } );


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


  goUrl(adress, index, paramsUrl, idMail, typeMess, activeNumber?, selectNum?) {

    this.idPost = this.emailItems[index].mail_to.replace('@', ''); // для вставки в URL
    this.idPostForHTTP = this.emailItems[index].mail_to; // ID ящика
    this.emailServ.selectNum = selectNum;
    this.emailServ.idPostForHTTP = this.idPostForHTTP;
    this.emailServ.adress = adress;
    this.emailServ.httpPost(
    adress,
    // tslint:disable-next-line:max-line-length
    {address: this.idPostForHTTP, box: `${this.emailServ.selectNum}`, limit: `${this.emailServ.lettersAmount}`, offset: '0'}).subscribe((data) => {
      this.emailServ.lettersList = data;
      this.emailServ.stateServ(); // save state on service
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


    if (this.emailServ.lettersList === 'noMessages') {  // DEL
      this.emailServ.noMessages = true;
    } else {this.emailServ.noMessages = false; } // del
    this.emailServ.stateServ(); // save state on service

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
  // this.emailServ.httpPost('http://10.0.1.33:3000/setbox', {id : id, box: booleanParam}).subscribe();
}


}
