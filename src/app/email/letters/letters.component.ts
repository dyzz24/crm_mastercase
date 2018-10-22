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


  activeEl(param, id) {

    this.emailServ.httpPost('http://10.0.1.10:3000/seen', {id : id, flag: true}).subscribe();  // перевожу в прочитанные сообщения
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
    senderName,
    time,
    avaSrc,
    caption,
    text,
    currentId,
    copy,
    mail_to
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

    this.emailServ.mailName = mail_to; // кому сообщение
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

    this.emailServ.httpPost('http://10.0.1.10:3000/setbox', {id : id, box: booleanParam}).subscribe();

  }

  // toggleSpamMark(i) {

  //   if (this.emailServ.noMessages === true) {  // DEL
  //     return;
  //   }
  //   if ( this.emailServ.lettersList[i].box !== 4 ) {
  //     return true;
  //   }
  //  }

  // *****************************************************************************

  toggleImportantMark(i, e, id) {  // для переключения удалить-добавить важное
    e.target.parentNode.classList.remove('visible');
    this.emailServ.httpPost('http://10.0.1.10:3000/flagged', {id : id, flag: true}).subscribe();
     this.emailServ.lettersList[i].flagged = ! this.emailServ.lettersList[i].flagged;
  }



//   messageConditionChecker(i) {
//     if (this.emailServ.lettersList[i].messageCondition !== undefined) {
//     let inworkLetter = false;
//     let haveattachLetter = false;
//     let importantLetter = false;

//     for (const key of this.emailServ.lettersList[i].messageCondition) {
//       if (key === 'inwork') {
//         inworkLetter = true;
//       }
//       if (key === 'haveAttach') {
//         haveattachLetter = true;
//       }
//       if (key === 'important') {
//         importantLetter = true;
//       }
//     }
//     return {
//       inworkLetter, haveattachLetter, importantLetter
//     };
//   } else {return false; }
// }

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


timeParse(item) {
const date = new Date(item);
date.setHours(date.getHours() - 3);

const nowDate = new Date();

const difference = +nowDate - +date;


if (difference < 86400000) {
  return `${date.getHours()}:${date.getMinutes()}`;
}

if (difference > 86400000 && difference < 172800000) {
  return `Вчера ${date.getHours()}:${date.getMinutes()}`;
}

if (difference > 172800000 && difference < 604800000) {
  const days = ['вс', 'пн', 'вт', 'ср', 'чт', 'пт', 'сб'];
  const weekDays = days[date.getDay()];
  return `${weekDays} ${date.getHours()}:${date.getMinutes()}`;
}
if (difference > 604800000 ) {
  const month = ['Янв', 'Фев', 'Март', 'Апр', 'Май', 'Июнь', 'Июль', 'Авг', 'Сент', 'Окт', 'Ноя', 'Дек'];
  const months = month[date.getMonth()];
  return `${date.getDate()} ${months} : ${date.getHours()}:${date.getMinutes()}`;
}


const hours = date.getHours();

}


deleteLetter(id, e) {

  e.target.parentNode.classList.remove('visible');
  this.emailServ.lettersList = this.emailServ.lettersList.filter((val , ind) => {
    if (val.id !== id) {
      return val;
    }
    });
    this.emailServ.visibleLett(15);


}

deleteLettersAll() {
  const id_for_delete = this.emailServ.idLetters;
}




}
