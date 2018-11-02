import { Component, OnInit, DoCheck, HostListener } from '@angular/core';
import { EmailServiceService } from '../email-service.service';
import { Router } from '@angular/router';
import { QuillEditorComponent } from 'ngx-quill';
import { attachers } from './attach';


@Component({
  selector: 'app-email-view',
  templateUrl: './email-view.component.html',
  styleUrls: ['./email-view.component.scss']
})
export class EmailViewComponent implements OnInit, DoCheck {

  visibleMenu = false;
  nameFrom;
  attachersList = attachers;


  constructor(public emailServ: EmailServiceService, private _rout: Router) { }

  ngOnInit() {
  }
  ngDoCheck() {
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
this.emailServ.selectedLetter = this.emailServ.lettersList[this.emailServ.index];  // текущее письмо для отображения!!!!
this.emailServ.currentId = this.emailServ.index;

this._rout.navigate([this.emailServ.urlParams + '/view' + '/' + this.emailServ.index]);
this.emailServ.mailsToArray = []; // очистил список отправителей
this.emailServ.mailsToArray.push(this.emailServ.selectedLetter.mail_from);  // добавил в список отправителей
this.emailServ.stateServ();
  }

  hideMenuShow() {
    this.visibleMenu = ! this.visibleMenu;
  }
  deleteLetter() { // удаление письма по клику
    const messageBody = document.querySelector('.messageContainer');
    messageBody.classList.add('dellLetter');
    const id = this.emailServ.selectedLetter;
    this.emailServ.httpPost(`${this.emailServ.ip}/mail/setbox`, {id : +id.id, box: 2}).subscribe();
    setTimeout(() => {
      for (let i = 0; i < this.emailServ.lettersList.length; i++) {
        if (this.emailServ.lettersList[i].id === id.id) {
          this.emailServ.selectedLetter = this.emailServ.lettersList[i + 1];
          this.emailServ.index = i;
        }
    }

    this.emailServ.lettersList = this.emailServ.lettersList.filter((val , ind) => {
      if (val !== id) {
        return val;
      }
      });
      messageBody.classList.remove('dellLetter');
      this.emailServ.stateServ();
    }, 500);
  }

  @HostListener('document:keydown', ['$event'])
  public KeyEvent(event: KeyboardEvent): void {
    if (event.key === 'ArrowDown') {
      this.selectMess(1);
    }
    if (event.key === 'ArrowUp') {
      this.selectMess(-1);
    }
    if (event.key === 'Delete') {
      this.deleteLetter();
    }
    event.stopPropagation();
  }

  addFrom() {
    const validate = /^[\w\.\d-_]+@[\w\.\d-_]+\.\w{2,4}$/i;
    if (this.nameFrom !== '' && validateAdress(this.nameFrom) !== -1) {
    this.emailServ.mailsToArray.push(this.nameFrom);
    this.emailServ.mailsToArray = this.emailServ.mailsToArray.filter((val, ind, self) => {
      return self.indexOf(val) === ind;
    });
    this.nameFrom = '';
  } else {
    alert('Введите корректный имейл');
  }
  function validateAdress(val) {
    return String(val).search(validate);
  }
  }

  deleteAdress(index) {
    this.emailServ.mailsToArray = this.emailServ.mailsToArray.filter((val, ind, self) => {
        if (ind !== index) {
          return val;
        }
    });
  }
}
