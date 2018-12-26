
import { Component, OnInit, ElementRef, DoCheck, ViewChild, Inject} from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { EmailServiceService } from './email-service.service';
import { AuthorizationService } from '../authorization.service';
import { SocketService } from '../socket.service';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { setContextDirty } from '@angular/core/src/render3/styling';


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
  folder_create = false;
  createSettingStatus = false;
  visibl: Array<boolean> = [];

  inboxName;
  inboxPassword;
  inboxFullName;
  sub;
  user_folders;

  selected_box;
  selected_folders;
adress;
  constructor(
    public element: ElementRef,
    private _rout: Router,
    @Inject(EmailServiceService) public emailServ: EmailServiceService,
    @Inject(AuthorizationService) private authorizationServ: AuthorizationService,
    @Inject(SocketService) private socketServ: SocketService,
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,

    ) {
   }

  ngOnInit() {

   const requestInterval = setInterval(() => {
        if (this.authorizationServ.accessToken !== undefined) {
          clearInterval(requestInterval); // если токен не пришел, продолжает опрашивать сервис авторизации (потом убрать)
          this.httpPost(`${this.emailServ.ip}/mail/box`, {} , {contentType: 'application/json'}).subscribe((data2) => {
      this.emailItems = data2.boxes;

      this.emailServ.all_user_mail_address = data2.boxes.map(val => {
        return val.address;
      });
      this.user_folders = data2.boxes.map(item => {

         return item.boxes.filter(val => val.id === 1).map(item2 => item2.childs)[0] || [];
      });
      this.emailServ.folders = data2.boxes;

      this.socketServ.lettersSocketConnect();
    });



        }
      }, 1000);


  }
  ngDoCheck() {
    // console.log(this.user_folders);
  }



  selected_box_id(id, folders) {
    this.selected_box = id;
    this.selected_folders = folders;
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

    // this.emailServ.selectedMess = selectNum; // выбор папки (вход - исх - отпр)
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
        this.folder_create = ! this.folder_create;
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
  this.folder_create = true;
  }

loadAmount(count) {   // для количества загруженных писем
  this.emailServ.lettersAmount = count;
}

drop_letter(e) {

  const data_mail_id = e.dataTransfer.getData('mail_id');
  this.folder_selection_exit(e);
  const data_folder_id = e.target.closest('.link_area').id;

  this.httpPost(`${this.emailServ.ip}/mail/setbox`, {
    mailId: +data_mail_id,
    boxId: +data_folder_id,
    address: this.emailServ.idPostForHTTP
  }).subscribe();
  this.emailServ.lettersList = this.emailServ.lettersList.filter((val , ind) => {
    if (+val.mail_id !== +data_mail_id) {
      return val;
    }
    });

}

folder_selection(e) {

  const target = e.target.closest('.type_message');
  target.classList.add('folder_selection');
}

folder_selection_exit(e) {

  const target = e.target.closest('.type_message');
  target.classList.remove('folder_selection');
}

allowDrop(e) {
  e.preventDefault();
}


}


