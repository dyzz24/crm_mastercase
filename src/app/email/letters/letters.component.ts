import { Component, DoCheck, ElementRef, OnInit, HostListener} from '@angular/core';
import { EmailServiceService } from '../email-service.service';
import { Router } from '@angular/router';

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




  constructor(
    public emailServ: EmailServiceService,
    public element: ElementRef,
    private rout: Router
  ) {}


  ngOnInit() {
  }

  ngDoCheck() {
    this.emailServ.stateServ(); // save state on service
  }


  activeEl(param) {
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
    senderName,
    time,
    avaSrc,
    caption,
    text,
    currentId,
    copy,
    condition
  ) {
    this.rout.navigate([this.emailServ.urlParams + '/view' + '/' + idLetter]);
    this.emailServ.senderName = senderName;
    this.emailServ.time = time;
    this.emailServ.avatar = avaSrc;
    this.emailServ.caption = caption;
    this.emailServ.text = text;
    this.emailServ.hiddenEmpty = true;

    this.emailServ.fullPath =
      this.emailServ.urlParams + '/view' + '/' + idLetter;
    this.emailServ.currentId = currentId; // test
    this.emailServ.lettersList[currentId].status = 'read';
    this.emailServ.copy = copy;

    this.emailServ.messageConditionCheckerInService(condition); // передаю статусы (синие) в сервис для отображения в компоненте view
  }

  selectedLetters(id, e, i) {   // множественный выбор писем в папке ****************
    if (e.target.checked) {
      this.emailServ.idLetters = [...this.emailServ.idLetters, i];  // индексы писем (от 0 до ...)
      this.emailServ.idLetters = this.emailServ.idLetters.filter(
        (val, ind, self) => {
          return self.indexOf(val) === ind;
        }
      );

    } else {
      this.emailServ.idLetters = this.emailServ.idLetters.filter(
        item => item !== i
      );
    }

    this.emailServ.checkerTrash();
  }

  newMessage() {
    this.rout.navigate([this.emailServ.urlParams + '/create']);
    this.emailServ.fullPath = this.emailServ.urlParams + '/create';
    this.emailServ.hiddenEmpty = true;
  }

  statusMessageCheck(param) {
    if (this.emailServ.lettersList[param].status === 'new') {
      return true;
    }
  }
  statusMessageSpam(param) {
    if (this.emailServ.lettersList[param].spam === true) {
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
      const parent = e.target.parentNode;
      const hiddenBlock = parent.querySelector('.hideMenu');
      hiddenBlock.classList.toggle('visible');
    }
  }
// ****************************************spam add - delete***************************** */
  spamMark(i, e, booleanParam) {
    // if (this.emailServ.lettersList[i].messageCondition !== undefined) {
    this.emailServ.lettersList[i].spam = booleanParam;
    e.target.parentNode.classList.remove('visible');
    this.rout.navigate([this.emailServ.urlParams]);
    this.emailServ.hiddenEmpty = false;
  }

  toggleSpamMark(i) {
    if (this.emailServ.noMessages === true) {  // DEL
      return;
    }
    if ( this.emailServ.lettersList[i].spam === false ) {
      return true;
    }
  }

  // *****************************************************************************
  importantMark(i, e, condition) {

    if (this.emailServ.lettersList[i].messageCondition.length === 0) {
      this.emailServ.lettersList[i].messageCondition.push('important');
    } else {
      this.emailServ.lettersList[i].messageCondition.filter((el, ind, arr) => {
        if (arr.indexOf('important') === -1) {
          arr.push('important');
        }
      });
    }
    e.target.parentNode.classList.remove('visible');    // может уберу **************************************************************
    this.emailServ.messageConditionCheckerInService(condition); // прокидываю измененные condition на сервис
  }

  deleteImportMark(i, e, condition ) {
    this.emailServ.lettersList[i].messageCondition.splice(this.emailServ.lettersList[i].messageCondition.indexOf('important'), 1);
    this.emailServ.messageConditionCheckerInService(condition);
    e.target.parentNode.classList.remove('visible');
  }

  toggleImportantMark(i) {  // для переключения удалить-добавить важное
    if (this.emailServ.noMessages === true) {  // DEL
      return;
    }
    if (this.emailServ.lettersList[i].messageCondition.length === 0) {
      return true;
    } else {
      if (this.emailServ.lettersList[i].messageCondition.indexOf('important') === -1) {
        return true;
      }
  }
  }


  messageConditionChecker(i) {
    if (this.emailServ.lettersList[i].messageCondition !== undefined) {
    let inworkLetter = false;
    let haveattachLetter = false;
    let importantLetter = false;

    for (const key of this.emailServ.lettersList[i].messageCondition) {
      if (key === 'inwork') {
        inworkLetter = true;
      }
      if (key === 'haveAttach') {
        haveattachLetter = true;
      }
      if (key === 'important') {
        importantLetter = true;
      }
    }
    return {
      inworkLetter, haveattachLetter, importantLetter
    };
  } else {return false; }
}

// tslint:disable-next-line:max-line-length
sent_incomingChecker(i) {  // проверка на входящие - исходящие сообщения, ибо исходящие не имеют статуса спама и важных!!!! (без нее глючат исходящие)
    if (this.emailServ.typeMess !== 'sent') {
      return true;
    } else { return false; }
}

scrollDown(e) {
  const container = document.querySelector('.letter__container');
  const maxScrollHeight = container.scrollHeight;  //     **высота скрытого блока   height 1565
  const maxHeight = container.getBoundingClientRect().height;   // **высота видимой области (849)
  const scrollPosition = container.scrollTop; // ** величина текущей прокрутки scroll 1-716
  const maxScroll = maxScrollHeight - maxHeight;  //  100% от макс возможного скролла
  const persent = (scrollPosition * 100) / maxScroll;  // текущий скролл в процентах


  if (persent > 85) {
    this.emailServ.step = this.emailServ.step += 15;
    this.emailServ.visibleLett(this.emailServ.step);
  }


}




}
