import { Component, DoCheck, ElementRef, OnInit} from '@angular/core';
import { EmailServiceService } from '../email-service.service';
import { Router, Scroll } from '@angular/router';
import { TouchSequence } from 'selenium-webdriver';
import { validateConfig } from '@angular/router/src/config';

@Component({
  selector: 'app-letters',
  templateUrl: './letters.component.html',
  styleUrls: ['./letters.component.scss']
})
export class LettersComponent implements DoCheck, OnInit {
  idEmail: any;
  messages = [];
  lettersItems: any;
  typeMess: any;
  openLetter = true;
  visibleMenu = true;
  counterAmount = 0;
  stopFlag = false;
  dataLetters;




  constructor(
    public emailServ: EmailServiceService,
    public element: ElementRef,
    private rout: Router
  ) {}


  ngOnInit() {
    this.emailServ.dataLetters = this.emailServ.lettersAmount;
  }

  ngDoCheck() {
  }


  activeEl(param, id) {

    // tslint:disable-next-line:max-line-length
    this.emailServ.httpPost('http://10.0.1.33:3000/mail/seen', {id : id, flag: true}).subscribe();  // перевожу в прочитанные сообщения
    this.emailServ.lettersList[param].seen = true;
    // tslint:disable-next-line:forin
    for (const i in this.emailServ.activeLett) {
      this.emailServ.activeLett[i] = false;
    }
    this.emailServ.activeLett[param] = !this.emailServ.activeLett[param];
  }

  hideAva(index) {
    this.emailServ.hideAvatars[index] = !this.emailServ.hideAvatars[index];
  }
  urlLetterView(
    idLetter,
    currentId,
  ) {
    this.rout.navigate([this.emailServ.urlParams + '/view' + '/' + idLetter]);
    this.emailServ.selectedLetter = this.emailServ.lettersList[idLetter];
    this.emailServ.index = idLetter;

    this.emailServ.hiddenEmpty = true;

    this.emailServ.fullPath =
    this.emailServ.urlParams + '/view' + '/' + idLetter;
    this.emailServ.currentId = currentId; // test

    this.emailServ.stateServ();
  }

  selectedLetters(id, e, i) {   // множественный выбор писем в папке ****************
    if (e.target.checked) {
      this.emailServ.idLetters = [...this.emailServ.idLetters, id];  // индексы писем (от 0 до ...)
      this.emailServ.idLetters = this.emailServ.idLetters.filter(
        (val, ind, self) => {
          return self.indexOf(val) === ind;
        }
      );
    } else {
      this.emailServ.idLetters = this.emailServ.idLetters.filter(
        item => item !== id
      );
    }

    this.emailServ.checkerTrash();
  }

  newMessage() {
    this.rout.navigate([this.emailServ.urlParams + '/create']);
    this.emailServ.fullPath = this.emailServ.urlParams + '/create';
    this.emailServ.hiddenEmpty = true;
  }

  statusMessageSpam(param) {
    if (this.emailServ.lettersList[param].box === 4) {
      return true;
    }
  }

  scrollTop() {
    const toTopBlock = document.querySelector('.letter__container');
    toTopBlock.scroll(0, 0);
  }

  menuShow(e) {
    if (e.target.className === 'letterMenuButt') {
      return;
    } else {
      const parent = e.target.parentNode.parentNode;
      const hiddenBlock = parent.querySelector('.hideMenu');
      hiddenBlock.classList.toggle('visible');
    }
  }
// ****************************************spam add - delete***************************** */
  spamMark(i, e, booleanParam, id) {
    // if (this.emailServ.lettersList[i].messageCondition !== undefined) {
    this.emailServ.lettersList[i].box = booleanParam;
    e.target.parentNode.classList.remove('visible');
    this.rout.navigate([this.emailServ.urlParams]);
    this.emailServ.hiddenEmpty = false;

    e.target.closest('.letter__prev').classList.add('letter__status-spam');

    setTimeout(() => {
      if (booleanParam === 4) {
      this.emailServ.lettersList = this.emailServ.lettersList.filter((val , ind) => {
        if (val.box !== 4) {
          return val;
        }
        });
      }
      if (booleanParam === 0) {
        this.emailServ.lettersList = this.emailServ.lettersList.filter((val , ind) => {
          if (val.box !== 0) {
            return val;
          }
          });
        }
        this.emailServ.httpPost('http://10.0.1.33:3000/mail/setbox', {id : id, box: booleanParam}).subscribe();
    }, 500);

  }


  // *****************************************************************************

  toggleImportantMark(i, e, id, boolean) {  // для переключения удалить-добавить важное
    e.target.parentNode.classList.remove('visible');
    this.emailServ.httpPost('http://10.0.1.33:3000/mail/flagged', {id : id, flag: boolean}).subscribe();
     this.emailServ.lettersList[i].flagged = ! this.emailServ.lettersList[i].flagged;
  }

// tslint:disable-next-line:max-line-length
sent_incomingChecker(i) {  // проверка на входящие - исходящие сообщения, ибо исходящие не имеют статуса спама и важных!!!! (без нее глючат исходящие)
    if (this.emailServ.typeMess !== 'sent') {
      return true;
    } else { return false; }
}


scrollDown() {
  const container = document.querySelector('.letter__container');
  const maxScrollHeight = container.scrollHeight;  //     **высота скрытого блока   height
  const maxHeight = container.getBoundingClientRect().height;   // **высота видимой области
  const scrollPosition = container.scrollTop; // ** величина текущей прокрутки scroll
  const maxScroll = maxScrollHeight - maxHeight;  //  100% от макс возможного скролла
  const persent = (scrollPosition * 100) / maxScroll;  // текущий скролл в процентах

  if (persent > 85) {
        if (this.emailServ.stopFlag === false) {
              if (this.emailServ.dataLetters !== this.emailServ.lettersAmount) {
                this.counterAmount = 0;
                return;
              }
              this.emailServ.stopFlag = true;
              this.counterAmount = this.counterAmount + this.emailServ.lettersAmount;
            this.emailServ.httpPost(
              this.emailServ.adress,
              // tslint:disable-next-line:max-line-length
              {address: this.emailServ.idPostForHTTP, box: this.emailServ.selectNum, limit: this.emailServ.lettersAmount, offset: this.counterAmount}).subscribe((data) => {
                this.emailServ.lettersList = this.emailServ.lettersList.concat(data);
                this.emailServ.stopFlag = false;
                this.emailServ.dataLetters = data.length;
                console.log(data.length);
                this.emailServ.stateServ();
                } );
      }
    }
}


deleteLetter(id, e) {

  e.target.parentNode.classList.remove('visible');
  e.target.closest('.letter__prev').classList.add('dellLetter');
  setTimeout(() => {
    const idelem = this.emailServ.selectedLetter;
    this.emailServ.httpPost('http://10.0.1.33:3000/mail/setbox', {id : id, box: 2}).subscribe();
      for (let i = 0; i < this.emailServ.lettersList.length; i++) {
        if (this.emailServ.lettersList[i].id === idelem.id) {
          this.emailServ.selectedLetter = this.emailServ.lettersList[i + 1];
          this.emailServ.index = i;
        }
    }

  this.emailServ.lettersList = this.emailServ.lettersList.filter((val , ind) => {
    if (val.id !== id) {
      return val;
    }
    });
    }, 500);
    // this.emailServ.hiddenEmpty = false;
    // this.rout.navigate([this.emailServ.urlParams]);

}

deleteLettersAll() {
  const id_for_delete = this.emailServ.idLetters;
}

}
