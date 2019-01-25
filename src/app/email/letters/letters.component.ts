import { Component, DoCheck, ElementRef, OnInit, HostListener, ViewChild, Inject, OnDestroy, ViewChildren } from '@angular/core';
import { EmailServiceService } from '../email-service.service';
import { Router, ActivatedRoute} from '@angular/router';

import { FormControl, ReactiveFormsModule} from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';

import { AuthorizationService } from '../../authorization.service';
import {NewMessageService} from '../new-message/new-message.service';




@Component({
  selector: 'app-letters',
  templateUrl: './letters.component.html',
  styleUrls: ['./letters.component.scss'],

})
export class LettersComponent implements DoCheck, OnInit, OnDestroy {




  counterAmount = 0; // начальный счетчик подзагрузки

  stopFlag = false;
  lettersCopy; // для поиска
  protectToCopy = false;
  temporaryLetters = []; // временный массив поиска
  filterError = false;
  stopScrollingLoadFiles = false;

  searchStringForHTTP;
  searchIdForHTTP = [];
  stopSearch = false;
  startSearch = true;
  successSearch = false;
  sub;
  subscription: Subscription;
  folder_list_state = false;
  open_hidden_menu = false;
  indexess_array = [];
  checkbox_flagged: boolean;
  selected_one_input_elem;
  min_max_arr;


  // @ViewChild('size_Check') // для отслеживания размера блока
  // size_Check: ElementRef;



  searchLettersInput: FormControl = new FormControl('');

  constructor(
    @Inject(AuthorizationService) private authorizationServ: AuthorizationService,
    @Inject(EmailServiceService) public emailServ: EmailServiceService,
    @Inject(NewMessageService) private newMessageService: NewMessageService,
    public element: ElementRef,
    private rout: Router,
    private http: HttpClient,
    private activatedRoute: ActivatedRoute
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
  ngOnInit() {
    // this.emailServ.fullPath = this.activatedRoute.snapshot.url;
    // this.emailServ.hiddenEmpty = true;
    this.subscription = this.activatedRoute.params.subscribe(params => {
      this.emailServ.idPostForHTTP = params.id1;
      this.emailServ.selectedMess = +params.id;
      this.emailServ.selectNum = +params.id;
      this.emailServ.haveResponse = false; // если убрать - не будет индикации при навигации по папкам (хз грузит или нет)
      // tslint:disable-next-line:forin
      this.httpPost(
        `${this.emailServ.ip}/mail/mails`,
        // tslint:disable-next-line:max-line-length
        {address: this.emailServ.idPostForHTTP, boxId: this.emailServ.selectNum, limit: this.emailServ.lettersAmount, offset: 0}).subscribe((data) => {

    this.emailServ.haveResponse = true;
          if (data.length === 0) {
            this.emailServ.notLettersFlag = true; // индикация, что письма отсутствуют
          } else {
            this.emailServ.notLettersFlag = false;
          }
          this.emailServ.lettersList = data; // главный массив всех всех писем

          this.emailServ.hideAvatars = this.emailServ.lettersList.map(val => {
            return val = false;
          }); // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

          this.emailServ.dataLetters = this.emailServ.lettersAmount;
          });

    }); // подписка


  }


  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  get_message() {
    this.httpPost(
      `${this.emailServ.ip}/mail/sync`,
      // tslint:disable-next-line:max-line-length
      {address: this.emailServ.idPostForHTTP}).subscribe((data) => {});
  }


  public httpPost(url: string, body, options?): Observable<any> {
    return this.http.post(url, body, {headers: {Authorization: `Bearer ${this.authorizationServ.accessToken}`}});
  }

  searchOnServer() {
    if ( this.searchStringForHTTP === undefined || this.searchStringForHTTP === '') {
        return;
    }
    this.httpPost(`${this.emailServ.ip}/mail/search`,
        { query: `${this.searchStringForHTTP}`, address: this.emailServ.idPostForHTTP, boxId: this.emailServ.selectNum,
        excludedIds: this.searchIdForHTTP},
        {contentType: 'application/json'})
        .subscribe(data => {
          if (data.length === 0) {
            this.filterError = true; // если не найдены письма выдаст сообщение в разметке
            this.stopScrollingLoadFiles = false; //
            this.stopSearch = false;
            this.startSearch = true;
            this.successSearch = false;
            return;
          }
          this.filterError = false;
          this.stopScrollingLoadFiles = true;
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
    this.input_checked_cancell();
    if (this.protectToCopy === false) {
      this.lettersCopy = this.emailServ.lettersList; // сохраняю исходные письма и сношу флаг
      this.protectToCopy = true;
    }
    this.stopSearch = true;
    this.startSearch = false;
    this.successSearch = false;
    const regExp = new RegExp (text, 'g');
    const replacer = '<b>' + text + '</b>';
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

    const new_search_array = allLettersList.filter((val, ind) => {
      if (val.from_address && val.from_address.toLowerCase().indexOf(text) >= 0 ) {
        return val;
  } else if (val.subject && val.subject.toLowerCase().indexOf(text) >= 0 ) {
          return val;
        } else if (val.text && val.text.toLowerCase().indexOf(text) >= 0 ) {
            return val;
        }
    });

       this.emailServ.lettersList = new_search_array; // подставляю найденные письма в представление

  }


  ngDoCheck() {
    // this.activatedRoute.params.subscribe(params => console.log(params));
// console.log(this.folder_list_state);

  }



  urlLetterView(event, idLetter, id) {
if (this.emailServ.lettersList[idLetter].seen === false) {
    this.httpPost(`${this.emailServ.ip}/mail/set`, { mailId: +id, flag: 'seen' , value: true, address: this.emailServ.idPostForHTTP})
    .subscribe(); // перевожу в прочитанные сообщения
  this.emailServ.lettersList[idLetter].seen = true;
}


  }

  selectedLetters(id, e, i) {
    // this.emailServ.hideAvatars[i] = !this.emailServ.hideAvatars[i];
    // множественный выбор писем в папке ****************
    if (e.shiftKey) {
      return;
    }
    if (e.target.checked) {
      this.emailServ.idLetters = [...this.emailServ.idLetters, +id];
      this.emailServ.hideAvatars[i] = true;
      this.emailServ.idLetters = this.emailServ.idLetters.filter(
        (val, ind, self) => {
          return self.indexOf(val) === ind;
        }
      );
    } else {
      this.emailServ.hideAvatars[i] = false;
      this.emailServ.idLetters = this.emailServ.idLetters.filter(
        item => item !== +id
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
    if (this.emailServ.lettersList[param].box_id === 4) {
      return true;
    }
  }

  scrollTop() {
    const toTopBlock = document.querySelector('.letter__container');
    toTopBlock.scroll(0, 0);
  }

  menuShow(e, i) {

      this.open_hidden_menu = true;
      const parent = e.target.parentNode.parentNode;
      const hiddenBlock = parent.querySelector('.hideMenu');
      if (hiddenBlock.classList.contains('visible')) { // если нажали второй раз на одно и тоже меню - убрать clickable_cancel_block
        this.open_hidden_menu = false;
      }
      const allHideBlock = document.querySelectorAll('.hideMenu');
      for (let key = 0; key < allHideBlock.length; key++) {
        if (key === i) {
          allHideBlock[key].classList.toggle('visible');
          continue;
        }
        allHideBlock[key].classList.remove('visible');
      }
  }
  // ****************************************spam add - delete***************************** */
  spamMark(i, e, booleanParam, id) {

    this.emailServ.lettersList[i].box_id = booleanParam;


    e.target.closest('.letter__prev').classList.add('letter__status-spam');


    setTimeout(() => {
      this.emailServ.lettersList.splice(i, 1);

      this.httpPost(`${this.emailServ.ip}/mail/setbox`, {
          mailId: +id,
          boxId: booleanParam,
          address: this.emailServ.idPostForHTTP
        })
        .subscribe();
        this.rout.navigate(['./'], { relativeTo: this.activatedRoute });
        this.emailServ.hiddenEmpty = false;
    }, 500);
  }

  // *****************************************************************************

  toggleImportantMark(i, e, id, boolean) {
    // для переключения удалить-добавить важное

    this.httpPost(`${this.emailServ.ip}/mail/set`, { mailId: +id, value: boolean, flag: 'flagged', address: this.emailServ.idPostForHTTP })
      .subscribe();
    this.emailServ.lettersList[i].flagged = !this.emailServ.lettersList[i]
      .flagged;
  }

  // tslint:disable-next-line:max-line-length


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

        this.httpPost(
          `${this.emailServ.ip}/mail/mails`,
            // tslint:disable-next-line:max-line-length
            {
              address: this.emailServ.idPostForHTTP,
              boxId: this.emailServ.selectNum,
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


data.map(val => {
  val = false;
  this.emailServ.hideAvatars.push(val);
});

            // this.emailServ.stateServ();
          });
      }
    }
  }

  deleteRestoreLetter(id, e, box, index) {
    e.target.closest('.letter__prev').classList.add('dellLetter');
    setTimeout(() => {
      const idelem = this.emailServ.selectedLetter;
      this.httpPost(`${this.emailServ.ip}/mail/setbox`, {
          mailId: +id,
          boxId: +box,
          address: this.emailServ.idPostForHTTP
        }).subscribe();
      // for (let i = 0; i < this.emailServ.lettersList.length; i++) {
      //   if (this.emailServ.lettersList[i].id === idelem.id) {
      //     this.emailServ.selectedLetter = this.emailServ.lettersList[i + 1];
      //     this.emailServ.index = i;
      //   }
      // }

      const navigatePath = this.rout.url.replace(/\/view\/.*/, ''); // стартовый урл
      this.emailServ.hiddenEmpty = false;
      this.rout.navigate([navigatePath]);

        this.emailServ.lettersList.splice(index, 1); // удаляю из представления


      if (this.emailServ.lettersList.length <= this.emailServ.lettersAmount) {// если подзагруза не было, восстанавливаю стартовое кол-во
        setTimeout(() => {
          this.httpPost(
            `${this.emailServ.ip}/mail/mails`,
              // tslint:disable-next-line:max-line-length
              {
                address: this.emailServ.idPostForHTTP,
                boxId: this.emailServ.selectNum,
                limit: this.emailServ.lettersAmount,
                offset: 0
              }
            )
            .subscribe(data => {
    this.emailServ.lettersList = data;
    this.input_checked_cancell();

      });
        }, 500);
    }
    }, 500);
  }

  input_checked_cancell() { // ф-я сбрасывает чекбоксы
                          // чистит ID, отменяет выделение по аватарке
    const allInputs = document.querySelectorAll('.checkbox');
    for (const key of <any>allInputs) {
      key.checked = false;
    }
    this.emailServ.hideAvatars = []; // чтоб инпуты работали
    this.emailServ.idLetters = []; // обнуляю корзину на удаление
    this.emailServ.checkerTrash();
  }

  importantMarkAll() {
    const id_for_important = this.emailServ.idLetters;
    // this.httpPost(`${this.emailServ.ip}/mail/set`, {
    //   mailId: id_for_important,
    //   value: true,
    //   flag: 'flagged',
    //   address: this.emailServ.idPostForHTTP })
    //   .subscribe();

      this.emailServ.lettersList.filter((val, ind, arr) => {
        for (const key of id_for_important) {
          if (+val.id === +key) {
              val.flagged = true;
          }
        }
      });

      this.input_checked_cancell();
  }

  deleteRestoreLettersAll(box) {

    const id_for_delete = this.emailServ.idLetters;

    this.emailServ.lettersList.filter((val, ind, arr) => {
      for (const key of id_for_delete) {

        if (val.mail_id === key) {



          arr[ind] = 'null'; // ставлю позицию в null для фильтрации и удаления

          this.httpPost(`${this.emailServ.ip}/mail/setbox`, {
            mailId: +val.mail_id,
          boxId: +box,
          address: this.emailServ.idPostForHTTP
          }).subscribe(data => {
          }
          );
          return arr;
        }
      }
    });
    this.emailServ.lettersList = this.emailServ.lettersList.filter(
      a => a !== 'null' // возвращаю массив без null (удаленных элементов)
    );

    if (this.emailServ.lettersList.length <= this.emailServ.lettersAmount) {// если подзагруза не было, восстанавливаю стартовое кол-во

      setTimeout(() => {
        this.httpPost(
          `${this.emailServ.ip}/mail/mails`,
            // tslint:disable-next-line:max-line-length
            {
              address: this.emailServ.idPostForHTTP,
              boxId: this.emailServ.selectNum,
              limit: this.emailServ.lettersAmount,
              offset: this.counterAmount
            }
          )
          .subscribe(data => {

  this.emailServ.lettersList = data;
  this.input_checked_cancell();
    });
      }, 1200);
  }
  // this.emailServ.stateServ(); // save state on service
  this.input_checked_cancell();
}

get_work(id, e, index) {


  this.httpPost(`${this.emailServ.ip}/mail/work`, { mailId: +id, value: true, address: this.emailServ.idPostForHTTP })
  .subscribe();

}

delete_work(id, e, index) {
  this.httpPost(`${this.emailServ.ip}/mail/work`, { mailId: +id, value: false, address: this.emailServ.idPostForHTTP })
  .subscribe();

}

// new_messages_dblClick(index) {
//   const letter = this.emailServ.lettersList[index];
//   // const id_for_request = this.emailServ.lettersList[this.emailServ.currentId].mail_id;
//   // this.httpPost(
//   //   `${this.emailServ.ip}/mail/mail`,
//   //   // tslint:disable-next-line:max-line-length
//   //   {address: this.emailServ.idPostForHTTP, mailId: id_for_request}).subscribe((dataMails) => {
//   //     const letter2part = dataMails;
//   //     const copytwo = Object.assign(dataMails, letter);
//   //     console.log(copytwo);
//   //   }) ;
//   // console.log(letter);
//   this.rout.navigate(['./create'], { relativeTo: this.activatedRoute });
//   // this.emailServ.new_clear_message();
// }

// @HostListener('window:resize', ['$event'])
// onResize(event) {
//   const size = this.size_Check.nativeElement.offsetWidth;  // отслеживаем ресайз блока НУЖНО ПОТОМ
//   console.log(size);
// }

move_folder() {
  this.folder_list_state = ! this.folder_list_state;
}

dragElemStart(elemId, seen_status, box_id, e) {
  e.dataTransfer.setData('mail_id', elemId);
  e.dataTransfer.setData('seen', seen_status);
  e.dataTransfer.setData('box_id', box_id);
}

close_menu() {

  this.open_hidden_menu = false;

      const allHideBlock = document.querySelectorAll('.hideMenu');
      for (let key = 0; key < allHideBlock.length; key++) {
          allHideBlock[key].classList.remove('visible');
      }
}

select_some_letters(e, index) {

  if (e.shiftKey) { // если зажали шифт
    if (e.target.className === 'checkbox') { // чтобы не всплывало событие до чекбокса

      if (e.target.checked) { // если изменили состояние инпута на тру


        if (!this.selected_one_input_elem) { // если с шифтом нажали без выбранного индекса по клику без шифта
          this.min_max_arr = [0, index]; // получаю массив от индексного (чекнутого) элема до макс. длины
          }
          if (this.selected_one_input_elem) {
            // tslint:disable-next-line:max-line-length
            this.min_max_arr = [this.selected_one_input_elem, index]; // получаю массив от индексного (чекнутого) элема до макс. длины
            this.min_max_arr.sort((a, b) => a - b);
            this.selected_one_input_elem = undefined; // удаляю выбранный кликом элем
            }
          this.emailServ.hideAvatars.fill(true, this.min_max_arr[0], this.min_max_arr[1] + 1); // заполняю тру для  представления
  for (let i = this.min_max_arr[0]; i <= this.min_max_arr[1]; i++) {
          this.emailServ.idLetters.push(this.emailServ.lettersList[i].mail_id); // пушу айдишники
        }
        this.emailServ.idLetters = this.emailServ.idLetters.filter( // фильтрую дубли
          (val, ind, self) => {
      if (self.indexOf(val) === ind) {
          return val;
      }
          }
        );

          const allInputs = document.querySelectorAll('.checkbox');
          for (let i = 0; i <= index; i++) {
            allInputs[i].checked = true;
          }

      } else { // если по чекнутому чекбоксу нажали
        e.target.checked = false; // скидываю его
        if (!this.selected_one_input_elem) {
          this.min_max_arr = [index, this.emailServ.idLetters.length]; // получаю массив от индексного (чекнутого) элема до макс. длины
          }
        if (this.selected_one_input_elem) {
        // tslint:disable-next-line:max-line-length
        this.min_max_arr = [this.selected_one_input_elem, this.emailServ.idLetters.length]; // получаю массив от индексного (чекнутого) элема до макс. длины
        this.min_max_arr.sort((a, b) => a - b);
        this.selected_one_input_elem = undefined;
        }

        this.emailServ.hideAvatars.fill(false, this.min_max_arr[0], this.min_max_arr[1] + 1);
        const allInputs = document.querySelectorAll('.checkbox');
          for (const key of <any>allInputs) {
            key.checked = false; // ставлю в тру
          }
          this.emailServ.idLetters.splice(index); // начиная с индекса по которому кликнули, удаляю все id-шки из выбранных
      }
    }
          this.emailServ.checkerTrash();
          console.log(this.emailServ.idLetters);
          return;
  }

this.selected_one_input_elem = index; // если просто клик, ловлю индекс

  }



}
