import { Component, DoCheck, ElementRef, OnInit } from '@angular/core';
import { EmailServiceService } from '../email-service.service';
import { Router, Scroll } from '@angular/router';
import { TouchSequence } from 'selenium-webdriver';
import { validateConfig } from '@angular/router/src/config';
import { FormControl, ReactiveFormsModule} from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { TimerPipe } from '../innerhtml.pipe';



@Component({
  selector: 'app-letters',
  templateUrl: './letters.component.html',
  styleUrls: ['./letters.component.scss'],
  providers: [ TimerPipe ]
})
export class LettersComponent implements DoCheck, OnInit {
  idEmail: any;
  messages = [];
  lettersItems: any;
  typeMess: any;
  openLetter = true;
  visibleMenu = true;
  counterAmount = 0;
  counterFromDownload = 0;
  stopFlag = false;
  dataLetters;
  lettersCopy;
  protectToCopy = false;
  temporaryLetters = [];

  filterError = false;
  stopScrollingLoadFiles = false;

  searchStringForHTTP;
  searchIdForHTTP = [];
  stopSearch = false;
  startSearch = true;
  successSearch = false;





  searchLettersInput: FormControl = new FormControl('');

  constructor(
    public emailServ: EmailServiceService,
    public element: ElementRef,
    private rout: Router,
    private datePipe: TimerPipe
  ) {

    this.searchLettersInput.valueChanges.pipe().subscribe(data => {
        if (data === '') {
          this.searchLetterFunc(data.toLowerCase(), this.emailServ.lettersList, true); // .toLowerCase() - отмена регистра при поиске
              this.stopSearch = false;
              this.startSearch = true;
              this.successSearch = false;
              this.searchStringForHTTP = '';
        } else {
          this.searchLetterFunc(data.toLowerCase(), this.emailServ.lettersList);
          this.searchStringForHTTP = data.toLowerCase();
        }
    });

    this.searchLettersInput.valueChanges.pipe(debounceTime(1500)).subscribe(datd => this.searchOnServer());
  }

  searchOnServer() {
    if ( this.searchStringForHTTP === undefined || this.searchStringForHTTP === '') {
        return;
    }
    this.emailServ.httpPost(`${this.emailServ.ip}/mail/search`,
        { searchQuery: `${this.searchStringForHTTP}`, address: this.emailServ.idPostForHTTP, box: this.emailServ.selectNum,
        expiredIds: this.searchIdForHTTP},
        {contentType: 'application/json'})
        .subscribe(data => {
          const temporaryArray = this.temporaryLetters; // временный массив с результатами поиска по клиенту
          const allSearch = temporaryArray.concat(data.filter((item) => { // конкачу с массивом который пришел с сервера
            return temporaryArray.indexOf(item) < 0; // фильтрую дубляж
           }));
           this.emailServ.lettersList = allSearch; // в представление
           this.successSearch = true;
           this.stopSearch = false;
        });
  }

  searchLetterFunc(text, allLettersList, stopFlag?) {
    if (this.protectToCopy === false) {
      this.lettersCopy = this.emailServ.lettersList; // сохраняю исходные письма и сношу флаг
      this.protectToCopy = true;
    }
    this.stopSearch = true;
    this.startSearch = false;
    this.successSearch = false;
    const regExp = new RegExp (text, 'g');
    const replacer = '<b>' + text + '</b>';
    let flagged;
    this.searchIdForHTTP = [];
    const stop = stopFlag;
    if (stop) { // если инпут пустой
      this.temporaryLetters = []; // очищаю временный массив писем
      this.emailServ.lettersList = this.lettersCopy; // вставляю исходный список писем
        this.protectToCopy = false; // разрешаю снова сохранять исходные письма
      this.filterError = false; // переключатель для "Письма не найдены" в html
      this.stopScrollingLoadFiles = false; // отменяю подгруз скроллом при работе поиска
      return;
    }

    this.temporaryLetters = allLettersList.filter((val, ind) => {
      if (val.mail_from.toLowerCase().indexOf(text) >= 0 ) {
        // val.mail_from = val.mail_from.replace(regExp, replacer);
        flagged = true;
        return val;
  } else if (val.subject.toLowerCase().indexOf(text) >= 0 ) {
        flagged = true;

          // val.subject = val.subject.replace(regExp, replacer);
          return val;
        } else if (val.html.toLowerCase().indexOf(text) >= 0 ) {
        // val.html = val.html.replace(regExp, replacer);
        flagged = true;
            return val;
        }
    });

    if (!flagged) {
      this.filterError = true; // если не найдены письма выдаст сообщение в разметке
      this.stopScrollingLoadFiles = false; //
      this.stopSearch = false;
      this.startSearch = true;
      this.successSearch = false;
      return;
    } else {
      this.filterError = false;
      this.stopScrollingLoadFiles = true;
    }
       this.emailServ.lettersList = this.temporaryLetters; // подставляю найденные письма в представление
       this.searchIdForHTTP = this.temporaryLetters.map(val => {
        return +val.id; // массив из id найденных писем для отправки на сервер
       });

  }

  ngOnInit() {
    this.emailServ.dataLetters = this.emailServ.lettersAmount;

    // const map_new_time_letters = this.emailServ.lettersList.map((val) => {
    //   const new_date = this.datePipe.transform(val.date, true);
    //   if (this.datePipe.transform(val.date, true) === new_date) {
    //     console.log(new_date);
    //   }
    // });
  }

  ngDoCheck() {
    // console.log( this.searchIdForHTTP);
  }

  activeEl(param, id) {

    this.emailServ
      .httpPost(`${this.emailServ.ip}/mail/seen`, { id: +id, flag: true })
      .subscribe(); // перевожу в прочитанные сообщения
    this.emailServ.lettersList[param].seen = true;
    // tslint:disable-next-line:forin
    for (const i in this.emailServ.activeLett) {
      this.emailServ.activeLett[i] = false;
    }
    this.emailServ.activeLett[param] = !this.emailServ.activeLett[param];

    this.emailServ.mailsToArray = []; // очистил список отправителей
    this.emailServ.mailsToArray.push(
      this.emailServ.lettersList[param].mail_from
    ); // добавил в список отправителей
    this.emailServ.subjectTo = this.emailServ.lettersList[param].subject;
  }

  hideAva(index) {
    this.emailServ.hideAvatars[index] = !this.emailServ.hideAvatars[index];
  }

  urlLetterView(idLetter) {
    this.rout.navigate([this.emailServ.urlParams + '/view/' + idLetter]);
    this.emailServ.selectedLetter = this.emailServ.lettersList[idLetter];
    this.emailServ.index = idLetter;

    this.emailServ.hiddenEmpty = true;

    this.emailServ.fullPath =
      this.emailServ.urlParams + '/view/' + idLetter;
    this.emailServ.currentId = idLetter; // test

    this.emailServ.stateServ();
  }

  selectedLetters(id, e, i) {
    // множественный выбор писем в папке ****************
    if (e.target.checked) {
      this.emailServ.idLetters = [...this.emailServ.idLetters, id]; // индексы писем (от 0 до ...)
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
        this.emailServ.lettersList = this.emailServ.lettersList.filter(
          (val, ind) => {
            if (val.box !== 4) {
              return val;
            }
          }
        );
      }
      if (booleanParam === 0) {
        this.emailServ.lettersList = this.emailServ.lettersList.filter(
          (val, ind) => {
            if (val.box !== 0) {
              return val;
            }
          }
        );
      }
      this.emailServ
        .httpPost(`${this.emailServ.ip}/mail/setbox`, {
          id: +id,
          box: booleanParam
        })
        .subscribe();
    }, 500);
  }

  // *****************************************************************************

  toggleImportantMark(i, e, id, boolean) {
    // для переключения удалить-добавить важное
    e.target.parentNode.classList.remove('visible');
    this.emailServ
      .httpPost(`${this.emailServ.ip}/mail/flagged`, { id: +id, flag: boolean })
      .subscribe();
    this.emailServ.lettersList[i].flagged = !this.emailServ.lettersList[i]
      .flagged;
  }

  // tslint:disable-next-line:max-line-length
  sent_incomingChecker(i) {
    // проверка на входящие - исходящие сообщения, ибо исходящие не имеют статуса спама и важных!!!! (без нее глючат исходящие)
    if (this.emailServ.typeMess !== 'sent') {
      return true;
    } else {
      return false;
    }
  }

  scrollDown() {
    if (this.stopScrollingLoadFiles === true) {
      return;
    }
    const container = document.querySelector('.letter__container');
    const maxScrollHeight = container.scrollHeight; //     **высота скрытого блока   height
    const maxHeight = container.getBoundingClientRect().height; // **высота видимой области
    const scrollPosition = container.scrollTop; // ** величина текущей прокрутки scroll
    const maxScroll = maxScrollHeight - maxHeight; //  100% от макс возможного скролла
    const persent = (scrollPosition * 100) / maxScroll; // текущий скролл в процентах
    if (persent > 85) {
      if (this.emailServ.stopFlag === false) {
        if (this.emailServ.dataLetters !== this.emailServ.lettersAmount) {
          this.counterAmount = 0;
          return;
        }
        this.emailServ.stopFlag = true;
        this.counterAmount = this.counterAmount + this.emailServ.lettersAmount;
        this.emailServ
          .httpPost(
            this.emailServ.adress,
            // tslint:disable-next-line:max-line-length
            {
              address: this.emailServ.idPostForHTTP,
              box: this.emailServ.selectNum,
              limit: this.emailServ.lettersAmount,
              offset: this.counterAmount
            }
          )
          .subscribe(data => {
            this.emailServ.lettersList = this.emailServ.lettersList.concat(
              data
            );
            this.emailServ.stopFlag = false;
            this.emailServ.dataLetters = data.length;
            this.emailServ.stateServ();
          });
      }
    }
  }

  deleteRestoreLetter(id, e, box) {
    e.target.parentNode.classList.remove('visible');
    e.target.closest('.letter__prev').classList.add('dellLetter');
    setTimeout(() => {
      const idelem = this.emailServ.selectedLetter;
      this.emailServ
        .httpPost(`${this.emailServ.ip}/mail/setbox`, {
          id: +id,
          box: box
        })
        .subscribe();
      for (let i = 0; i < this.emailServ.lettersList.length; i++) {
        if (this.emailServ.lettersList[i].id === idelem.id) {
          this.emailServ.selectedLetter = this.emailServ.lettersList[i];
          this.emailServ.index = i;
        }
      }

      this.emailServ.lettersList = this.emailServ.lettersList.filter(
        (val, ind) => {
          if (val.id !== id) {
            return val;
          }
        }
      );
      if (this.emailServ.lettersList.length === 0) {
        this.rout.navigate([this.emailServ.urlParams]);
      }
    }, 500);
  }

  deleteRestoreLettersAll(box) {

    const id_for_delete = this.emailServ.idLetters;
    this.emailServ.lettersList.filter((val, ind, arr) => {
      for (const key of id_for_delete) {
        if (val.id === key) {
          arr[ind] = 'null'; // ставлю позицию в null для фильтрации и удаления
          this.emailServ.httpPost(`${this.emailServ.ip}/mail/setbox`, {
            id: +val.id,
            box: box
          }).subscribe();
          this.emailServ.lettersList = arr;
        }
      }
    });
    this.emailServ.lettersList = this.emailServ.lettersList.filter(
      a => a !== 'null' // возвращаю массив без null (удаленных элементов)
    );
    if (this.emailServ.lettersList.length <= this.emailServ.lettersAmount) {// если подзагруза не было, восстанавливаю стартовое кол-во

      setTimeout(() => {
        this.emailServ
          .httpPost(
            this.emailServ.adress,
            // tslint:disable-next-line:max-line-length
            {
              address: this.emailServ.idPostForHTTP,
              box: this.emailServ.selectNum,
              limit: this.emailServ.lettersAmount,
              offset: this.counterAmount
            }
          )
          .subscribe(data => {
            this.emailServ.lettersList = data;
            this.emailServ.stateServ(); // save state on service
  this.emailServ.hideAvatars = []; // чтоб инпуты работали
  this.emailServ.idLetters = []; // обнуляю корзину на удаление
  this.emailServ.checkerTrash(); // убираю иконку (иначе инпуты глючат)
    });
      }, 500);
  }
  this.emailServ.stateServ(); // save state on service
  this.emailServ.hideAvatars = []; // чтоб инпуты работали
  this.emailServ.idLetters = []; // обнуляю корзину на удаление
  this.emailServ.checkerTrash(); // убираю иконку (иначе инпуты глючат)
}
}
