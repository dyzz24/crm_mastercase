
import { Component, OnInit, ElementRef, DoCheck, ViewChild, Inject} from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { EmailServiceService } from './email-service.service';
import { AuthorizationService } from '../authorization.service';
import { SocketService } from '../socket.service';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';

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
  visibl: Array<boolean> = [];

  inboxName;
  inboxPassword;
  inboxFullName;
  sub;
  user_folders;

  folders = [
    {name: '1level', id: '12', child:
    [{name: '2level', id: '13', child:
    [{name: '3level', id: '14', child:
    [{name: '4level', id: '7', child: [{name: 'test21', id: '8'},
    {name: 'test22', id: '33'}]}]}]}, {name: '2level-2', id: '22', child: [{name: '3level-2', id: '38'}]}]}];
adress;
  constructor(
    public element: ElementRef,
    private _rout: Router,
    @Inject(EmailServiceService) public emailServ: EmailServiceService,
    @Inject(AuthorizationService) private authorizationServ: AuthorizationService,
    @Inject(SocketService) private socketServ: SocketService,
    private http: HttpClient,
    private activatedRoute: ActivatedRoute
    ) {
   }

  ngOnInit() {
    // this.emailItems = [{address:'one'}, {address:'two'}]

   const requestInterval = setInterval(() => {
        if (this.authorizationServ.accessToken !== undefined) {
          clearInterval(requestInterval); // если токен не пришел, продолжает опрашивать сервис авторизации (потом убрать)
          this.httpPost(`${this.emailServ.ip}/mail/box`, {} , {contentType: 'application/json'}).subscribe((data2) => {
      this.emailItems = data2.boxes;
      this.socketServ.lettersSocketConnect();
    });

    this.httpPost(`${this.emailServ.ip}/mail/box`, {} , {contentType: 'application/json'}).subscribe((dataFolders) => {

      this.user_folders = dataFolders.boxes;

     });


        }
      }, 1000);


  }
  ngDoCheck() {
    // console.log(this.emailServ.idPostForHTTP);
  }

  open_hidden_folders(e) {
      const parent = e.target.closest('.folders__child');
      const hiddenFolders = parent.querySelector('.hidden_subfolder');
      hiddenFolders.classList.toggle('visibl_hidden_folders');
      // this.emailServ.hiddenEmpty = false;

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
  }


  goUrl(selectNum?) {

    this.emailServ.selectedMess = selectNum; // выбор папки (вход - исх - отпр)
    this.emailServ.hideAvatars = [];
    this.emailServ.idLetters = [];

    this.emailServ.checkerTrash();
    this.emailServ.hiddenEmpty = false;

    this.emailServ.allLettersId = [];

    this.emailServ.dataLetters = this.emailServ.lettersAmount; // для рестарка функции подгруза писем

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


