
import { Component, OnInit, ElementRef, DoCheck, ViewChild, Inject, ChangeDetectorRef,
ChangeDetectionStrategy, AfterViewInit} from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { EmailServiceService } from './email-service.service';
import { AuthorizationService } from '../authorization.service';
import { SocketService } from '../socket.service';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import {global_params} from '../global';
// import { setContextDirty } from '@angular/core/src/render3/styling';


@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmailComponent implements OnInit, DoCheck, AfterViewInit {


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
  current_address_folder_open;


  constructor(
    public element: ElementRef,
    private _rout: Router,
    private cd: ChangeDetectorRef,
    @Inject(EmailServiceService) public emailServ: EmailServiceService,
    @Inject(AuthorizationService) private authorizationServ: AuthorizationService,
    @Inject(SocketService) private socketServ: SocketService,
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,

    ) {
   }

  ngOnInit() {

    this.current_address_folder_open = localStorage.getItem('open_folder_address');


      this.httpPost(`${global_params.ip}/mail/box`, {} , {contentType: 'application/json'}).subscribe((data2) => {
      this.emailItems = data2.boxes;
      this.emailServ.all_user_mail_address = data2.boxes.map(val => {
        return val.address;
      });

        this.user_folders = JSON.parse(localStorage.getItem('folders_state')) ||  data2.boxes.map(item => {

          return item.boxes.filter(val => val.id === 1).map(item2 => item2.childs)[0] || [];
       });






      this.emailServ.folders = data2.boxes;

      this.socketServ.lettersSocketConnect();
      // console.log(data2.stats);
      const counts = data2.stats.reduce((index, value) => {
        index[value.address] = index[value.address] || {};

        index[value.address][value.box_id] = +value.count;

        return index;
      }, {});
      // console.log(counts);


      // const fold = counts['seo@insat.ru']

      this.emailServ.counts = counts;

      // console.log(this.emailServ.counts);

    });






  }

  ngAfterViewInit() {
    this.cd.detectChanges();
  }

  ngDoCheck() {
    // console.log(this.user_folders);
  }



  selected_box_id(id, folders) {
    this.selected_box = id;
    this.selected_folders = folders;
  }

  open_hidden_folders(e, folder_id?, index?, first_flag?, address?) {
    if (first_flag) { // если открыли корневую вкладку
      const storage_address = localStorage.getItem('open_folder_address'); // пушим адрес ящика в локал
      if (storage_address === null || storage_address !== address) {
        localStorage.setItem('open_folder_address', address);
        this.current_address_folder_open = address;
      } else {
        localStorage.setItem('open_folder_address', null);
        this.current_address_folder_open = null;
      }
          return;
    }


this.deep_search(this.user_folders, folder_id);

  }

  deep_search(arr, folder_id) {
      arr.filter((val, ind, array) => {

        if (typeof(val) === 'object' && val.length > 0) { // если есть ещё вложенность
          this.deep_search(val, folder_id);
        }

          if (val.childs) { // если у объектов есть чилды массивы, пройтись по ним
            this.deep_search(val.childs, folder_id);
          }

          if (+val.id === +folder_id) { // если нужная папка содержит заданный id

if (array[ind]['is_open'] === true) {
  array[ind]['is_open'] = false;
} else {
  array[ind]['is_open'] = true; // добавляю ключ к объекту
}


          }

      });
      localStorage.setItem('folders_state', JSON.stringify(arr)); // сохраняю массив в локал
      // console.log(this.user_folders);
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
  const seen_status = e.dataTransfer.getData('seen'); // ловлю статус (прочитанное - нет)
  const previous_folders_box_id = e.dataTransfer.getData('box_id'); // ловлю предыдущий бокс папки (откуда перенес)
  const data_folder_id = e.target.closest('.link_area').id;

  this.httpPost(`${global_params.ip}/mail/envelope/update`, {
    mailId: +data_mail_id,
    boxId: +data_folder_id,
    address: this.emailServ.idPostForHTTP
  }).subscribe();
  this.emailServ.lettersList = this.emailServ.lettersList.filter((val , ind) => {
    if (+val.mail_id !== +data_mail_id) {
      return val;
    }
    });
    if (seen_status === 'false') { // если оно НЕ прочитанное

      if (!this.emailServ.counts[this.emailServ.idPostForHTTP][data_folder_id]) { // если упадет NaN
        this.emailServ.counts[this.emailServ.idPostForHTTP][data_folder_id] = 1; // ставлю 1
        this.emailServ.counts[this.emailServ.idPostForHTTP][previous_folders_box_id] =
        +this.emailServ.counts[this.emailServ.idPostForHTTP][previous_folders_box_id] - 1; // меняю счетчик папки из которой перенес

      } else {
      // tslint:disable-next-line:max-line-length
      this.emailServ.counts[this.emailServ.idPostForHTTP][data_folder_id] =
      +this.emailServ.counts[this.emailServ.idPostForHTTP][data_folder_id] + 1 ; // меняю счетчик папки в которую перенес
      this.emailServ.counts[this.emailServ.idPostForHTTP][previous_folders_box_id] =
      +this.emailServ.counts[this.emailServ.idPostForHTTP][previous_folders_box_id] - 1; // меняю счетчик папки из которой перенес

    }
  }
}


allowDrop(e) {
  e.preventDefault();
}

aux_do() {
  this._rout.navigate([{outlets: {aux: 'add_email'}}]);
}


}


