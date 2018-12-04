
import { Component, OnInit, ElementRef, DoCheck, ViewChild, Inject} from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { EmailServiceService } from './email-service.service';
import { AuthorizationService } from '../authorization.service';
import { SocketService } from '../socket.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss']
})
export class EmailComponent implements OnInit, DoCheck {

  emailItems;
  socket: SocketIOClient.Socket;




  inboxMenuStatus = false;
  createMenuStatus = false;
  deleteMenuStatus = false;
  editMenuStatus = false;
  createSettingStatus = false;
  visibl: Array<boolean> = [false, false, false];

  inboxName;
  inboxPassword;
  inboxFullName;
  sub;


  adress;
  constructor(
    public element: ElementRef,
    private _rout: Router,
    public emailServ: EmailServiceService,
    @Inject(AuthorizationService) private authorizationServ: AuthorizationService,
    @Inject(SocketService) private socketServ: SocketService,
    private http: HttpClient,
    private activatedRoute: ActivatedRoute
    ) {
   }

  ngOnInit() {
   const requestInterval = setInterval(() => {
        if (this.authorizationServ.accessToken !== undefined) {
          clearInterval(requestInterval); // если токен не пришел, продолжает опрашивать сервис авторизации (потом убрать)
          this.httpPost(`${this.emailServ.ip}/mail/boxes`, {} , {contentType: 'application/json'}).subscribe((data2) => {
      this.emailItems = data2;
      this.emailServ.idPostForHTTP = this.emailItems[0].address; // ID ящика
    });
        }
      }, 1000);
  }
  ngDoCheck() {
    // console.log(this.emailServ.idPostForHTTP);
  }


  public httpPost(url: string, body, options?): Observable<any> {
    return this.http.post(url, body, {headers: {Authorization: `Bearer ${this.authorizationServ.accessToken}`}});
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


  goUrl( index, paramsUrl,  selectNum?) {

    // this.showSuccess(); // test TOSTER
    //  console.log(this.emailServ.lettersList);
    this.emailServ.haveResponse = false;
    this.adress = `${this.emailServ.ip}/mail/mails`;
    this.emailServ.idPostForHTTP = this.emailItems[index].address; // ID ящика
    this.emailServ.selectNum = selectNum;
    this.emailServ.adress = this.adress;
    this.httpPost(
    this.adress,
    // tslint:disable-next-line:max-line-length
    {address: this.emailServ.idPostForHTTP, box: this.emailServ.selectNum, limit: this.emailServ.lettersAmount, offset: 0}).subscribe((data) => {
this.emailServ.haveResponse = true;
      if (data.length === 0) {
        this.emailServ.notLettersFlag = true; // индикация, что письма отсутствуют
      } else {
        this.emailServ.notLettersFlag = false;
      }
      this.emailServ.lettersList = data;
      } );


    // this._rout.navigate(['email/' + this.emailServ.idBox + paramsUrl]);

    this.emailServ.selectedMess = selectNum;
    this.emailServ.urlParams = `email/${this.emailServ.idBox}${paramsUrl}`;

    this.emailServ.fullPath = `email/${this.emailServ.idBox}${paramsUrl}`;

    this.emailServ.hideAvatars = [];
    this.emailServ.idLetters = [];

    this.emailServ.checkerTrash();
    this.emailServ.hiddenEmpty = false;
    this.emailServ.activeLett = [];
    this.emailServ.allLettersId = [];


    // this.emailServ.stateServ(); // save state on service

    this.emailServ.dataLetters = this.emailServ.lettersAmount; // для рестарка функции подгруза писем
    this.socketServ.lettersSocketConnect();

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


