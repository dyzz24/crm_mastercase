import { Component, DoCheck, ElementRef, OnInit, HostListener, ViewChild, Inject, OnDestroy, ViewChildren } from '@angular/core';
import { EmailServiceService } from '../email-service.service';
import { Router, ActivatedRoute} from '@angular/router';

import { FormControl, ReactiveFormsModule} from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';

import { AuthorizationService } from '../../authorization.service';
import {NewMessageService} from '../new-message/new-message.service';
import {global_params} from '../../global';




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
  startSearch = false;
  successSearch = false;
  sub;
  subscription: Subscription;
  folder_list_state = false;
  open_hidden_menu = false;
  indexess_array = [];
  checkbox_flagged: boolean;
  selected_one_input_elem;
  min_max_arr;
  selected_flag = false;


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


    this.searchLettersInput.valueChanges.pipe().subscribe(datd => this.search_letter(datd));

    this.searchLettersInput.valueChanges.pipe((debounceTime(1500))).subscribe(datd => this.search_on_server());
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
        `${global_params.ip}/mail/box/`,
        // tslint:disable-next-line:max-line-length
        {address: this.emailServ.idPostForHTTP, boxId: this.emailServ.selectNum, limit: this.emailServ.lettersAmount, offset: 0}).subscribe((data) => {
    this.emailServ.haveResponse = true;
          if (data.length === 0) {
            this.emailServ.notLettersFlag = true; // индикация, что письма отсутствуют
          } else {
            this.emailServ.notLettersFlag = false;
          }
          this.emailServ.lettersList = data; // главный массив всех всех писем
          // console.log( this.emailServ.lettersList)
          this.canc_select(); // отмена селекта если были выбраны письма
          this.emailServ.hideAvatars = this.emailServ.lettersList.map(val => {
            return val = false;

          }); // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

          this.emailServ.dataLetters = this.emailServ.lettersAmount;
          });

    }); // подписка на изменение роута


  }

  search_letter(data) {
    this.canc_select();
    if (this.protectToCopy === false) {
      this.lettersCopy = this.emailServ.lettersList; // сохраняю исходные письма и сношу флаг
      this.protectToCopy = true;
    }

    if (data === '') { // если инпут пустой

      this.temporaryLetters = []; // очищаю временный массив писем
      this.emailServ.lettersList = this.lettersCopy; // вставляю исходный список писем
        this.protectToCopy = false; // разрешаю снова сохранять исходные письма
      this.filterError = false; // переключатель для "Письма не найдены" в html
      this.stopScrollingLoadFiles = false; // отменяю подгруз скроллом при работе поиска
      this.startSearch = false;
      // this.filterError = false; // переключатель для "Письма не найдены" в html
      return;
    }


    this.startSearch = true;
    this.successSearch = false;
    this.searchIdForHTTP = [];

    const new_search_array = this.lettersCopy.filter((val, ind) => {
      if (val.from_address && val.from_address.toLowerCase().indexOf(data) >= 0 ) { // сам поиск
        return val;
      }
      if (val.preview && val.preview.toLowerCase().indexOf(data) >= 0) {
          return val;
      }

    });

      if (new_search_array.length > 0) { // если совпадения есть
        this.emailServ.lettersList = new_search_array;
      }

      this.searchStringForHTTP = data;
    }

    search_on_server() {

      if ( this.searchStringForHTTP === undefined || this.searchStringForHTTP === '') {
        return;
    }
    this.httpPost(`${global_params.ip}/mail/search`,
        { query: `${this.searchStringForHTTP}`, address: this.emailServ.idPostForHTTP, boxId: this.emailServ.selectNum,
        excludedIds: this.searchIdForHTTP},
        {contentType: 'application/json'})
        .subscribe(data2 => {
          if (data2.length === 0) {
            this.filterError = true; // если не найдены письма выдаст сообщение в разметке
            this.stopScrollingLoadFiles = false; //
            this.startSearch = false; // закончит крутилку
            this.successSearch = false;
            return;
          }
          this.filterError = false;
          this.stopScrollingLoadFiles = true;
          const temporaryArray = this.temporaryLetters; // временный массив с результатами поиска по клиенту

          const allSearch = temporaryArray.concat(data2.filter((item) => { // конкачу с массивом который пришел с сервера
            return temporaryArray.indexOf(item) < 0; // фильтрую дубляж
           }));
           this.emailServ.lettersList = allSearch; // в представление
           this.successSearch = true;
        });

    }




  ngOnDestroy() {
    this.subscription.unsubscribe();

  }

  get_message() {
    this.httpPost(
      `${global_params.ip}/mail/box/sync`,
      // tslint:disable-next-line:max-line-length
      {address: this.emailServ.idPostForHTTP}).subscribe((data) => {});
  }


  public httpPost(url: string, body, options?): Observable<any> {
    return this.http.post(url, body, {headers: {Authorization: `Bearer ${this.authorizationServ.accessToken}`}});
  }

  ngDoCheck() {
    // this.activatedRoute.params.subscribe(params => console.log(params));
// console.log(this.folder_list_state);
  }


  urlLetterView(event, idLetter, id) { // перевод в прочитанное сообщение из непрочитанного
    if (event.target.classList.contains('unread_btn')) {
      return;
    }
if (this.emailServ.lettersList[idLetter].seen === false) {
    // tslint:disable-next-line:max-line-length
    this.httpPost(`${global_params.ip}/mail/envelope/update`, { mailId: +id, seen: true, address: this.emailServ.idPostForHTTP})
    .subscribe(); // перевожу в прочитанные сообщения
  this.emailServ.lettersList[idLetter].seen = true;


  this.emailServ.counts[this.emailServ.idPostForHTTP][this.emailServ.selectedMess] =
  this.emailServ.counts[this.emailServ.idPostForHTTP][this.emailServ.selectedMess] - 1; // вычитаю 1 непрочитанное из счетчика непрочитанных

}
  }

  unread(mail_id, index) {
    this.httpPost(`${global_params.ip}/mail/envelope/update`, { mailId: +mail_id, seen: false, address: this.emailServ.idPostForHTTP})
    .subscribe(); // перевожу в прочитанные сообщения
  this.emailServ.lettersList[index].seen = false;

  this.emailServ.counts[this.emailServ.idPostForHTTP][this.emailServ.selectedMess] =
  this.emailServ.counts[this.emailServ.idPostForHTTP][this.emailServ.selectedMess] + 1; // вычитаю 1 непрочитанное из счетчика непрочитанных
  return;
  }


  filters_select(id_for_send, select_for_html, inputs_checkbox, base_array, condition, flag) {
    // БУДЕТ ИСПОЛЬЗОВАТЬСЯ В ОСНОВНОЙ КОЛБАСЕ ПИСЕМ
    // ф-я принимает 5 арг: массив id писем, массив булевых для представления, базовый массив с письмами и селектор рабочего инпута
    // и состояние поиска по главному массиву
    // condition - флаг поиска по массиву писем (либо)
            const allInputs = <any>document.querySelectorAll(inputs_checkbox); // беру все инпуты
            base_array.filter((val, ind) => { // пробегаюсь по главному массиву писем
              if (val[condition] === flag) { // если элемент массива совпадает с искомым условием
                select_for_html[ind] = true; // в данных индексах представления ставлю тру для отображения в html
                id_for_send.push(val.draft_id); // пушу id искомых писем в пустой массивец (для отправки на серв к примеру)
                allInputs[ind].checked = true; // ставлю инпуты с нужными индексами в тру (для отображение представления)
              }
            });
      }

      filters_select_letter(e) {
        if (e === 'favor') {
          this.canc_select(); // очищаю предыдущее выделение (если есть) все инпуты, id писем и html привязку чищу
          this.filters_select(
            this.emailServ.idLetters,
            this.emailServ.hideAvatars,
            '.avatar_checkboxes',
            this.emailServ.lettersList,
            'flagged', true);
        }

        if (e === 'unread') {
          this.canc_select(); // очищаю предыдущее выделение (если есть) все инпуты, id писем и html привязку чищу
          this.filters_select(
            this.emailServ.idLetters,
            this.emailServ.hideAvatars,
            '.avatar_checkboxes',
            this.emailServ.lettersList,
            'seen', false);
        }

        if (e === 'attachments') {
          this.canc_select(); // очищаю предыдущее выделение (если есть) все инпуты, id писем и html привязку чищу
          this.filters_select(
            this.emailServ.idLetters,
            this.emailServ.hideAvatars,
            '.avatar_checkboxes',
            this.emailServ.lettersList,
            'attachments', true);
        }

    }


  select_all_or_cancell_all_inputs(flag) {
    this.selected_flag = flag;
    if (this.selected_flag) {
        this._select();
    } else {
      this.canc_select();
    }
}


  canc_select() { // отменяет выделение всех писем
    this.emailServ.hideAvatars = this.emailServ.lettersList.map(val => val = false);
    this.emailServ.idLetters = [];
    const allInputs = <any>document.querySelectorAll('.avatar_checkboxes');
    for (const key of allInputs) {
        key.checked = false;
    }
  }

  _select() { // выделяет все письма
    this.emailServ.hideAvatars = this.emailServ.lettersList.map(val => val = true);
    this.emailServ.idLetters = this.emailServ.lettersList.map(val => val.mail_id);
    const allInputs = <any>document.querySelectorAll('.avatar_checkboxes');
    for (const key of allInputs) {
        key.checked = true;
    }
  }

  selectedLetters(id, e, i) {
    // this.emailServ.hideAvatars[i] = !this.emailServ.hideAvatars[i];
    // множественный выбор писем в папке ****************
    if (e.shiftKey) {
      return; // еслт по шифту - выходим
    }
    if (e.target.checked) { // если инпут чекнули
      this.emailServ.idLetters = [...this.emailServ.idLetters, +id]; // закладываю id письмеца
      this.emailServ.hideAvatars[i] = true; // ставлю в true аватарку (для отображения полосы выделенного письма)

    } else {// если по чекнутому инпуту клик
      this.emailServ.hideAvatars[i] = false; // удаляю из доп полосы
      this.emailServ.idLetters = this.emailServ.idLetters.filter(
        item => item !== +id // удаляю id из списка id
      );
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

      this.httpPost(`${global_params.ip}/mail/envelope/update`, {
          mailId: +id,
          boxId: booleanParam,
          address: this.emailServ.idPostForHTTP
        })
        .subscribe();
        this.rout.navigate(['./'], { relativeTo: this.activatedRoute });
    }, 500);

    this.canc_select();
  }

  // *****************************************************************************

  toggleImportantMark(i, e, id, boolean) {
    // для переключения удалить-добавить важное

    this.httpPost(`${global_params.ip}/mail/envelope/update`,
    { mailId: +id, flagged: boolean, address: this.emailServ.idPostForHTTP })
      .subscribe();
    this.emailServ.lettersList[i].flagged = !this.emailServ.lettersList[i].flagged;
  }



  scrollDown() {
    if (this.stopScrollingLoadFiles === true) { // если идет поиск по письмам - не подгружаю на скроле файлы
      return;
    }
    const container = document.querySelector('.letter__container');
    const maxScrollHeight = container.scrollHeight; //     **высота скрытого блока   height
    const maxHeight = container.getBoundingClientRect().height; // **высота видимой области
    const scrollPosition = container.scrollTop; // ** величина текущей прокрутки scroll
    const maxScroll = maxScrollHeight - maxHeight; //  100% от макс возможного скролла
    const persent = (scrollPosition * 100) / maxScroll; // текущий скролл в процентах
    if (persent > 85) { // если проскролили почти донизу
      if (this.emailServ.stopFlag === false) {
        if (this.emailServ.dataLetters !== this.emailServ.lettersAmount) { // в ответе с сервера приходят конверты
          this.counterAmount = 0;                                     // если длина пачки конвертов отличается от подгружаемого лимита
          return;                                                   // выхожу и не загружаю больше (значит все письма с сервера отгружены)
        }
        this.emailServ.stopFlag = true; // ставлю флаг, чтобы не дублировать запросы на сервер
        this.counterAmount = this.counterAmount + this.emailServ.lettersAmount; // счетчик загруженных писем
                                              // используется для запроса на следующую пачку (25 к примеру) писем
        this.httpPost(
          `${global_params.ip}/mail/box/`,
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
            this.emailServ.stopFlag = false; // отключаю флаг и разрешаю снова слать запросы на сервер
            this.emailServ.dataLetters = data.length; // чекаю длинну присланного массива, что бы если загружены все - больше не грузить



                data.map(val => { // добавление в хайд аватар флагов, для дальнейшего использования
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
      this.httpPost(`${global_params.ip}/mail/envelope/update`, {
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
      this.rout.navigate([navigatePath]);

        this.emailServ.lettersList.splice(index, 1); // удаляю из представления


      if (this.emailServ.lettersList.length <= 17) {// если подзагруза не было, восстанавливаю стартовое кол-во
        setTimeout(() => {
          this.httpPost(
            `${global_params.ip}/mail/envelope/`,
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


      });
        }, 500);
    }
    }, 500);

    this.canc_select();
  }



  importantMarkAll() {
    const id_for_important = this.emailServ.idLetters;


    const all_data_for_http = [];
    for (const key of this.emailServ.idLetters) {
      all_data_for_http.push(
        {mailId: key,
          flagged: true,
        address: this.emailServ.idPostForHTTP}
      );
    }

    this.httpPost(`${global_params.ip}/mail/envelope/update`, all_data_for_http)
      .subscribe();

      this.emailServ.lettersList.filter((val, ind, arr) => {
        for (const key of id_for_important) {
          if (+val.mail_id === +key) {
              val.flagged = true;
          }
        }
      });
      this.canc_select();
  }


  deleteRestoreLettersAll(box) {

    const id_for_delete = this.emailServ.idLetters;


    const all_data_for_http = [];
    for (const key of this.emailServ.idLetters) {
      all_data_for_http.push(
        {mailId: key,
          boxId: +box,
          address: this.emailServ.idPostForHTTP}
      );
    }

    this.httpPost(`${global_params.ip}/mail/envelope/update`, all_data_for_http).subscribe(data => {
    }
    );

    this.emailServ.lettersList.filter((val, ind, arr) => {
      for (const key of id_for_delete) {


        if (val.mail_id === key) {

          if (val.seen === false) { // проверяю, если письма непрочитанные

this.emailServ.counts[this.emailServ.idPostForHTTP][this.emailServ.selectedMess] =
this.emailServ.counts[this.emailServ.idPostForHTTP][this.emailServ.selectedMess] - 1; // вычитаю 1 непрочитанное из счетчика непрочитанных
                                                                                      // в текущей папке
if (!this.emailServ.counts[this.emailServ.idPostForHTTP][box]) { // если вдруг такой ключ не создан ещё
  this.emailServ.counts[this.emailServ.idPostForHTTP][box] = 0;
}
this.emailServ.counts[this.emailServ.idPostForHTTP][box] =
this.emailServ.counts[this.emailServ.idPostForHTTP][box] + 1; // и пребавляю непрочитанные в папку
                                                                                      // в которую переносим письма
          }

          arr[ind] = 'null'; // ставлю позицию в null для фильтрации и удаления
          return arr;
        }


      }
    });
    this.emailServ.lettersList = this.emailServ.lettersList.filter(
      a => a !== 'null' // возвращаю массив без null (удаленных элементов)
    );

    this.canc_select(); // сбрасываю инпуты

    if (this.emailServ.lettersList.length <= 17) {// если подзагруза не было, восстанавливаю стартовое кол-во

      setTimeout(() => {
        this.httpPost(
          `${global_params.ip}/mail/envelope/`,
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

    });
      }, 1200);
  }
  // this.emailServ.stateServ(); // save state on service

}

get_work(id, e, index) {


  this.httpPost(`${global_params.ip}/mail/envelope/update`, { mailId: +id, workUserId: true, address: this.emailServ.idPostForHTTP })
  .subscribe();

}

delete_work(id, e, index) {
  this.httpPost(`${global_params.ip}/mail/envelope/update`, { mailId: +id, workUserId: false, address: this.emailServ.idPostForHTTP })
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

close_menu() { // закрывает меню колбасы конвертика

  this.open_hidden_menu = false;

  const allInputs = <any>document.querySelectorAll('.settings_checkbox');
  for (let i = 0; i <= allInputs.length - 1; i++) {
    allInputs[i].checked = false;
  }
}

select_some_letters(e, index) {

  if (e.shiftKey) { // если зажали шифт
    if (e.target.className === 'avatar_checkboxes hidden_checkbox') { // чтобы не всплывало событие до чекбокса

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

          // const allInputs = document.querySelectorAll('.checkbox') as HTMLDivElement;
          const allInputs: HTMLDivElement = <any>document.querySelectorAll('.avatar_checkboxes.hidden_checkbox');
          for (let i = this.min_max_arr[0]; i <= this.min_max_arr[1]; i++) {
            allInputs[i].checked = true;
          }

      } else { // если по чекнутому чекбоксу нажали
        e.target.checked = false; // скидываю его
        const allInputs = <any>document.querySelectorAll('.avatar_checkboxes.hidden_checkbox');
        if (!this.selected_one_input_elem) {
          this.min_max_arr = [index, allInputs.length - 1]; // получаю массив от индексного (чекнутого) элема до макс. длины
          }
        if (this.selected_one_input_elem) {
        // tslint:disable-next-line:max-line-length
        this.min_max_arr = [this.selected_one_input_elem, index]; // получаю массив от индексного (чекнутого) элема до кликного индекса
        this.min_max_arr.sort((a, b) => a - b);
        this.selected_one_input_elem = undefined;
        }

        this.emailServ.hideAvatars.fill(false, this.min_max_arr[0], this.min_max_arr[1] + 1);

          for (let i = this.min_max_arr[0]; i <= this.min_max_arr[1]; i++) {
            allInputs[i].checked = false;
          }
          this.emailServ.idLetters.splice(index); // начиная с индекса по которому кликнули, удаляю все id-шки из выбранных
      }
    }
          this.emailServ.checkerTrash();

          return;
  }

this.selected_one_input_elem = index; // если просто клик, ловлю индекс


  }

  cancell_checked(e, index) {

    const allInputs = <any>document.querySelectorAll('.settings_checkbox');
          for (let i = 0; i <= allInputs.length - 1; i++) {
            if (index === i) {
              continue;
            }
            allInputs[i].checked = false;
          }

          if (e.target.checked === true) {
            this.open_hidden_menu = true;
          } else {
            this.open_hidden_menu = false;
          }


}




}
