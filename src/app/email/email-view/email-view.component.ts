import { Component, OnInit, DoCheck, HostListener } from '@angular/core';
import { EmailServiceService } from '../email-service.service';
import { Router } from '@angular/router';
import { QuillEditorComponent } from 'ngx-quill';


@Component({
  selector: 'app-email-view',
  templateUrl: './email-view.component.html',
  styleUrls: ['./email-view.component.scss']
})
export class EmailViewComponent implements OnInit, DoCheck {

  visibleMenu = false;



  constructor(public emailServ: EmailServiceService, private _rout: Router) { }

  ngOnInit() {
  }
  ngDoCheck() {
    this.emailServ.stateServ();
  }

  closeViewer() {
    this._rout.navigate([this.emailServ.urlParams]);
    this.emailServ.hiddenEmpty = false;
    this.emailServ.fullPath = this.emailServ.urlParams;
    this.emailServ.stateServ();
  }
  newMessage() {
    this._rout.navigate([this.emailServ.urlParams + '/create']);
    this.emailServ.fullPath = this.emailServ.urlParams + '/create';
    this.emailServ.hiddenEmpty = true;
  }

  selectMess(n) {

    this.emailServ.allLettersId = this.emailServ.visibleLetters.map((val, ind) => {
      return ind;
    });



this.emailServ.currentInd = this.emailServ.currentId; // получаю id текущего ( открытого ) письма


for (let i = 0; i < this.emailServ.allLettersId.length; i++) {
if (this.emailServ.allLettersId[i] === this.emailServ.currentInd) {
  this.emailServ.index = i; // текущий индекс в массиве
  this.emailServ.activeLett = [...this.emailServ.activeLett, false];
}
}

this.emailServ.index = this.emailServ.index + n;
if (this.emailServ.index === this.emailServ.allLettersId.length) {
  this.emailServ.index = 0;
}

if (this.emailServ.index < 0) {
  this.emailServ.index = this.emailServ.allLettersId.length - 1;
}


for (let i = 0; i < this.emailServ.activeLett.length; i++) {
this.emailServ.activeLett[i] = false;
}

this.emailServ.activeLett[this.emailServ.index] = true;


this.emailServ.currentObjectLetter = this.emailServ.visibleLetters[this.emailServ.index]; // head param


this.emailServ.result = this.emailServ.allLettersId[this.emailServ.index];

      this.emailServ.senderName = this.emailServ.currentObjectLetter.mail_from;
      this.emailServ.time = this.emailServ.currentObjectLetter.date;
      // this.emailServ.avatar = this.emailServ.currentObjectLetter.avaSrc;
      this.emailServ.caption = this.emailServ.currentObjectLetter.subject;
      this.emailServ.text = this.emailServ.currentObjectLetter.html;
      this.emailServ.hiddenEmpty = true;

      this.emailServ.currentId = this.emailServ.index; // test
      this.emailServ.copy = this.emailServ.currentObjectLetter.emailCopy;

      this.emailServ.messageConditionCheckerInService(this.emailServ.currentObjectLetter.messageCondition);


this._rout.navigate([this.emailServ.urlParams + '/view' + '/' + this.emailServ.result]);
  }

  hideMenuShow() {
    this.visibleMenu = ! this.visibleMenu;
  }

  @HostListener('document:keydown', ['$event'])
  public KeyEvent(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown') {
      this.selectMess(1);
    }
    if (event.key === 'ArrowUp') {
      this.selectMess(-1);
    }
    event.stopPropagation();
  }

}
