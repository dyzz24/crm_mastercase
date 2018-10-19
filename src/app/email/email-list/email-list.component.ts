import { Component, OnInit, ElementRef, DoCheck} from '@angular/core';
import { emails } from './emails';
import { Router } from '@angular/router';
import { EmailServiceService } from '../email-service.service';
import { lettersInbox } from '../email-list/emails';
import { lettersSent } from '../email-list/emails';

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
  //  this.emailServ.getHttp('http://10.0.1.10:3000/boxes?id=1');

   this.emailServ.get('http://10.0.1.10:3000/boxes?id=1').subscribe((data) => this.emailItems = data );

    if (localStorage.length === 0) {
      this.emailServ.activeEl = [];
    }
  }
  ngDoCheck() {
    console.log(this.emailServ.visibleLetters);
    this.emailServ.stateServ();
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


  goUrl(index, paramsUrl, idMail, typeMess, activeNumber?, selectNum?, mailName?) {
    this.idPost = this.emailItems[index].address.replace('@', '');
    this.idPostForHTTP = this.emailItems[index].address;
    this.emailServ.get(`http://10.0.1.10:3000/mails`, {params:
    {address: this.idPostForHTTP}}).subscribe((data) => this.emailServ.lettersList = data );


    this._rout.navigate(['email/' + this.idPost + paramsUrl]);
    this.emailServ.idBox = this.idPost;
    this.typeMessage = typeMess;
    this.emailServ.typeMess = this.typeMessage;
    this.emailServ.selectedMess = selectNum;
    this.emailServ.urlParams = `email/${this.idPost}${paramsUrl}`;

    this.emailServ.fullPath = `email/${this.idPost}${paramsUrl}`;
    // const stateUrls = this.emailServ.urlParams;
    // localStorage.setItem('stateURL', JSON.stringify(stateUrls));

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
    this.emailServ.mailName = mailName;
    this.emailServ.idLetters = [];

    this.emailServ.checkerTrash();
    this.emailServ.hiddenEmpty = false;
    this.emailServ.activeLett = [];
    this.emailServ.allLettersId = [];

    // ************************** */

    // if (this.emailServ.typeMess === 'incoming') {
    //   this.messagesForFilters = lettersInbox;
    // }
    // if (this.emailServ.typeMess === 'sent') {
    //   this.messagesForFilters = lettersSent;
    // }
    // const filters = elems => {
    //   for (const keyMass of elems) {
    //     // tslint:disable-next-line:forin
    //     for (const i in keyMass) {
    //       if (i === this.emailServ.idBox) {
    //         return keyMass[i];
    //       }
    //     }
    //   }
    // };
    if (this.emailServ.lettersList === 'noMessages') {  // DEL
      this.emailServ.noMessages = true;
    } else {this.emailServ.noMessages = false; } // del
    this.emailServ.visibleLett(15); // TEST
    this.emailServ.step = 15;

    this.emailServ.stateServ(); // save state on service



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
}
