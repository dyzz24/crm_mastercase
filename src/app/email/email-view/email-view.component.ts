import { Component, OnInit, DoCheck, HostListener, ViewEncapsulation, ElementRef, ViewChild } from '@angular/core';
import { EmailServiceService } from '../email-service.service';
import { Router } from '@angular/router';
import { QuillEditorComponent } from 'ngx-quill';
import { attachers } from './attach';


@Component({
  selector: 'app-email-view',
  templateUrl: './email-view.component.html',
  styleUrls: ['./email-view.component.scss'],
  encapsulation: ViewEncapsulation.Native
})
export class EmailViewComponent implements OnInit, DoCheck {
  @ViewChild('messageContainer')
  messageContainer: ElementRef;
  visibleMenu = false;
  nameFrom;
  attachersList = attachers;



  constructor(public emailServ: EmailServiceService,
    private _rout: Router,
    private elem: ElementRef) { }

  ngOnInit() {
  }
  ngDoCheck() {
    // console.log(this.emailServ.selectedLetter);
  }

  closeViewer() {
    this._rout.navigate([this.emailServ.urlParams]);
    this.emailServ.hiddenEmpty = false;
    this.emailServ.fullPath = this.emailServ.urlParams;
    // this.emailServ.stateServ();
  }
  newMessage() {
    this._rout.navigate([this.emailServ.urlParams + '/create']);
    this.emailServ.fullPath = this.emailServ.urlParams + '/create';
    this.emailServ.hiddenEmpty = true;
  }

  selectMess(n) {

    this.emailServ.checkerLengthArray_bcc_cc();

this.emailServ.index = this.emailServ.index + n;
if (this.emailServ.index === this.emailServ.lettersList.length) {
  this.emailServ.index = 0;
}

if (this.emailServ.index < 0) {
  this.emailServ.index = this.emailServ.lettersList.length - 1;
}

for (let i = 0; i < this.emailServ.activeLett.length; i++) {
this.emailServ.activeLett[i] = false;
}

this.emailServ.activeLett[this.emailServ.index] = true;
this.emailServ.selectedLetter = this.emailServ.lettersList[this.emailServ.index];  // текущее письмо для отображения!!!!
this.emailServ.currentId = this.emailServ.index;

this._rout.navigate([this.emailServ.urlParams + '/view' + '/' + this.emailServ.index]);
this.emailServ.mailsToArray = []; // очистил список отправителей
this.emailServ.mailsToArray.push(this.emailServ.selectedLetter.from_address);  // добавил в список отправителей
// this.emailServ.stateServ();
  }

  hideMenuShow() {
    this.visibleMenu = ! this.visibleMenu;
  }
  deleteLetter() { // удаление письма по клику
    const messageBody = this.messageContainer.nativeElement;
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
      // this.emailServ.stateServ();
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


  all_view(e) {
    if (e.target.classList.contains('cc')) {
      if (this.emailServ.cut_cc_adressess_array !== this.emailServ.selectedLetter.cc_addresses) {
      this.emailServ.cut_cc_adressess_array = this.emailServ.selectedLetter.cc_addresses;
      e.target.value = '';
      e.target.classList.add('input_return');
      } else {
        e.target.classList.remove('input_return');
        this.emailServ.checkerLengthArray_bcc_cc();
        e.target.value = this.emailServ.selectedLetter.cc_addresses.length - this.emailServ.cut_cc_adressess_array.length;
      }
    }
    if (e.target.classList.contains('addressess')) {
      if (this.emailServ.cut_addressess_array !== this.emailServ.selectedLetter.to_addresses) {
      this.emailServ.cut_addressess_array = this.emailServ.selectedLetter.to_addresses;
      e.target.value = '';
      e.target.classList.add('input_return');
      } else {
        e.target.classList.remove('input_return');
        this.emailServ.checkerLength_addressess();
        e.target.value = this.emailServ.selectedLetter.to_addresses.length - this.emailServ.cut_addressess_array.length;
      }
    }
  }
}
