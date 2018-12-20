import { Component, DoCheck, ElementRef, OnInit, HostListener, ViewChild, Inject, OnDestroy, ViewChildren } from '@angular/core';
import { EmailServiceService } from '../email-service.service';
import { Router, ActivatedRoute} from '@angular/router';

import { FormControl, ReactiveFormsModule} from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { SocketService } from '../../socket.service';
import { AuthorizationService } from '../../authorization.service';




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

  // @ViewChild('size_Check') // для отслеживания размера блока
  // size_Check: ElementRef;



  searchLettersInput: FormControl = new FormControl('');

  constructor(
    @Inject(AuthorizationService) private authorizationServ: AuthorizationService,
    @Inject(EmailServiceService) public emailServ: EmailServiceService,
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
      if (this.authorizationServ.accessToken === undefined) { // если авторизации не было, будет опрашивать сервис авторизации по интервалу
        this.loading_list_letters(true);
      } else {
        this.loading_list_letters(false);
      }

    }); // подписка

  }

    private loading_list_letters(boolean) {


        if (boolean) {
          const requestInterval = setInterval(() => {
            if (this.authorizationServ.accessToken !== undefined) {
              clearInterval(requestInterval); // если токен не пришел, продолжает опрашивать сервис авторизации ()
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
                  this.emailServ.dataLetters = this.emailServ.lettersAmount;
                  });

            }
          }, 1000);
        }
        if (!boolean) {
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
              console.log(data);

              this.emailServ.dataLetters = this.emailServ.lettersAmount;

              });

        }
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
          if (data.length === 0 && this.temporaryLetters.length === 0) {
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

    this.temporaryLetters = allLettersList.filter((val, ind) => {
      if (val.from_address && val.from_address.toLowerCase().indexOf(text) >= 0 ) {
        return val;
  } else if (val.subject && val.subject.toLowerCase().indexOf(text) >= 0 ) {

          return val;
        } else if (val.text && val.text.toLowerCase().indexOf(text) >= 0 ) {
            return val;
        }
    });
       this.emailServ.lettersList = this.temporaryLetters; // подставляю найденные письма в представление
       this.searchIdForHTTP = this.temporaryLetters.map(val => {
        return +val.id; // массив из id найденных писем для отправки на сервер
       });

  }


  ngDoCheck() {
    // console.log( this.emailServ.lettersList);
    // this.activatedRoute.params.subscribe(params => console.log(params));
  }



  hideAva(index) {
    this.emailServ.hideAvatars[index] = !this.emailServ.hideAvatars[index];
  }

  urlLetterView(event, idLetter, id) {
    if (event.target.className === 'letter__settings') {
      return;
    }
                  // tslint:disable-next-line:forin
  // for (const i in this.emailServ.activeLett) {
  //   this.emailServ.activeLett[i] = false;
  // }

    this.httpPost(`${this.emailServ.ip}/mail/set`, { mailId: +id, flag: 'seen' , value: true, address: this.emailServ.idPostForHTTP})
    .subscribe(); // перевожу в прочитанные сообщения
  this.emailServ.lettersList[idLetter].seen = true;
    this.emailServ.selectedLetter = this.emailServ.lettersList[idLetter];
    this.emailServ.index = idLetter;


    // this.emailServ.fullPath =
      // this.emailServ.urlParams + '/view/' + idLetter;
    // this.emailServ.checkerLengthArray_bcc_cc();
    // this.emailServ.checkerLength_addressess();
    // this.emailServ.stateServ();
    // console.log(this.emailServ.selectedLetter);
  }

  selectedLetters(id, e, i) {
    // множественный выбор писем в папке ****************
    if (e.target.checked) {
      this.emailServ.idLetters = [...this.emailServ.idLetters, +id]; // индексы писем (от 0 до ...)
      this.emailServ.idLetters = this.emailServ.idLetters.filter(
        (val, ind, self) => {
          return self.indexOf(val) === ind;
        }
      );
    } else {
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
    if (e.target.className === 'letterMenuButt') {
      return;
    } else {
      const parent = e.target.parentNode.parentNode;
      const hiddenBlock = parent.querySelector('.hideMenu');
      const allHideBlock = document.querySelectorAll('.hideMenu');
      for (let key = 0; key < allHideBlock.length; key++) {
        if (key === i) {
          allHideBlock[key].classList.toggle('visible');
          continue;
        }
        allHideBlock[key].classList.remove('visible');
      }
    }
  }
  // ****************************************spam add - delete***************************** */
  spamMark(i, e, booleanParam, id) {

    // if (this.emailServ.lettersList[i].messageCondition !== undefined) {
    this.emailServ.lettersList[i].box_id = booleanParam;
    e.target.parentNode.classList.remove('visible');
    // this.rout.navigate([this.emailServ.urlParams]);


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
    e.target.parentNode.classList.remove('visible');
    this.httpPost(`${this.emailServ.ip}/mail/set`, { mailId: +id, value: boolean, flag: 'flagged', address: this.emailServ.idPostForHTTP })
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
            // this.emailServ.stateServ();
          });
      }
    }
  }

  deleteRestoreLetter(id, e, box) {
    e.target.parentNode.classList.remove('visible');
    e.target.closest('.letter__prev').classList.add('dellLetter');
    setTimeout(() => {
      const idelem = this.emailServ.selectedLetter;
      this.httpPost(`${this.emailServ.ip}/mail/setbox`, {
          mailId: +id,
          boxId: +box,
          address: this.emailServ.idPostForHTTP
        }).subscribe();
      for (let i = 0; i < this.emailServ.lettersList.length; i++) {
        if (this.emailServ.lettersList[i].id === idelem.id) {
          this.emailServ.selectedLetter = this.emailServ.lettersList[i + 1];
          this.emailServ.index = i;
        }
      }

      const navigatePath = this.rout.url.replace(/\/view\/.*/, ''); // стартовый урл
      if (this.emailServ.currentId <= 0) { // если урл равен или меньше нуля
        const new_url = navigatePath + '/view/' + 0; // ставлю в ноль
        this.rout.navigate([new_url]); // перехожу
      } else {
        const new_url = navigatePath + '/view/' + (+this.emailServ.currentId - 1); // иначе при удалении перехожу к предыдущему элементу let
        this.rout.navigate([new_url]);
      }

        this.emailServ.lettersList.splice(this.emailServ.currentId, 1); // удаляю из представления


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
    this.emailServ.hideAvatars = []; // чтоб инпуты работали
    this.emailServ.idLetters = []; // обнуляю корзину на удаление
    this.emailServ.checkerTrash(); // убираю иконку (иначе инпуты глючат)
      });
        }, 500);
    }
    }, 500);
  }

  importantMarkAll() {
    const allInputs = document.querySelectorAll('.checkbox');
    for (const key of <any>allInputs) {
      key.checked = false;
    }
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

      this.emailServ.hideAvatars = []; // чтоб инпуты работали
      this.emailServ.idLetters = []; // обнуляю корзину на удаление
      this.emailServ.checkerTrash(); // убираю иконку (иначе инпуты глючат)
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
            // this.emailServ.stateServ(); // save state on service
  this.emailServ.hideAvatars = []; // чтоб инпуты работали
  this.emailServ.idLetters = []; // обнуляю корзину на удаление
  this.emailServ.checkerTrash(); // убираю иконку (иначе инпуты глючат)
    });
      }, 500);
  }
  // this.emailServ.stateServ(); // save state on service
  this.emailServ.hideAvatars = []; // чтоб инпуты работали
  this.emailServ.idLetters = []; // обнуляю корзину на удаление
  this.emailServ.checkerTrash(); // убираю иконку (иначе инпуты глючат)
}

get_work(id, e, index) {

  // if (this.emailServ.lettersList[index].work_user_id === null ||
  //   this.emailServ.lettersList[index].work_user_id.userId === this.authorizationServ.userId
  // ) {
  e.target.parentNode.classList.remove('visible');
  this.httpPost(`${this.emailServ.ip}/mail/work`, { mailId: +id, value: true, address: this.emailServ.idPostForHTTP })
  .subscribe();
  // this.emailServ.lettersList[index].work_user_id = {email: this.emailServ.idPostForHTTP,
  //   firstName: this.authorizationServ.firstName,
  //   lastName: this.authorizationServ.lastName,
  //   userId: this.authorizationServ.userId};
  // this.emailServ.lettersList[index].draft  = this.emailServ.idPostForHTTP;
  // } else {
  //   e.target.parentNode.classList.remove('visible');
  //   this.httpPost(`${this.emailServ.ip}/mail/work`, { mailId: +id, value: true, address: this.emailServ.idPostForHTTP })
  // .subscribe();
  //   return;
  // }
}

delete_work(id, e, index) {
  // if (this.emailServ.lettersList[index].work_user_id.userId === this.authorizationServ.userId) {
  e.target.parentNode.classList.remove('visible');
  this.httpPost(`${this.emailServ.ip}/mail/work`, { mailId: +id, value: false, address: this.emailServ.idPostForHTTP })
  .subscribe();
  // this.emailServ.lettersList[index].work_user_id = null;
    // } else {
    //   e.target.parentNode.classList.remove('visible');
    //   this.httpPost(`${this.emailServ.ip}/mail/work`, { mailId: +id, value: false, address: this.emailServ.idPostForHTTP })
    //   .subscribe();
    //    return;
    // }

}

new_messages_dblClick(index) {
  const letter = this.emailServ.lettersList[index];
  // const id_for_request = this.emailServ.lettersList[this.emailServ.currentId].mail_id;
  // this.httpPost(
  //   `${this.emailServ.ip}/mail/mail`,
  //   // tslint:disable-next-line:max-line-length
  //   {address: this.emailServ.idPostForHTTP, mailId: id_for_request}).subscribe((dataMails) => {
  //     const letter2part = dataMails;
  //     const copytwo = Object.assign(dataMails, letter);
  //     console.log(copytwo);
  //   }) ;
  // console.log(letter);
  this.emailServ.newMessage_DblClick(letter.from_address, letter.to_addresses, letter.subject, letter.text, letter.html);
  this.rout.navigate(['./create'], { relativeTo: this.activatedRoute });
  // this.emailServ.new_clear_message();
}

// @HostListener('window:resize', ['$event'])
// onResize(event) {
//   const size = this.size_Check.nativeElement.offsetWidth;  // отслеживаем ресайз блока НУЖНО ПОТОМ
//   console.log(size);
// }

move_folder() {
  // this.folders_component.move_letter();
}
}
