import { Component, OnInit, Input, DoCheck, Inject, inject, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { EmailServiceService } from '../email-service.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { AuthorizationService } from '../../authorization.service';
import { ToastrService} from 'ngx-toastr';
import { ReadVarExpr, IfStmt } from '@angular/compiler';
import {NewMessageService} from '../new-message/new-message.service';
import { DatePipe } from '@angular/common';
import { isDate } from '@angular/common/src/i18n/format_date';
import {global_params} from '../../global';

import { FormControl, ReactiveFormsModule} from '@angular/forms';
import { debounceTime } from 'rxjs/operators';



@Component({
  selector: 'app-new-message',
  templateUrl: './new-message.component.html',
  styleUrls: ['./new-message.component.scss']
})
export class NewMessageComponent implements OnInit, DoCheck {

  private babl_menu_show = [];
  public messages;
  public messages_for_draft: FormControl = new FormControl('');
  public id_for_draft;
  constructor(
    @Inject(EmailServiceService) public emailServ: EmailServiceService,
    private _rout: Router,
    private http: HttpClient,
    @Inject(ToastrService) private toastrServ: ToastrService,
    @Inject(AuthorizationService) private authorizationServ: AuthorizationService,
    @Inject(NewMessageService) private newMessageService: NewMessageService,
    private activatedRoute: ActivatedRoute
    ) {
      this.messages_for_draft.valueChanges.pipe((debounceTime(global_params.timeout_save_draft))).subscribe(data => this.save_draft(data));


     }
     public from;
     private mail_id; // del
     private status; // del
     subscription: Subscription;

    public to = []; // array for send
    public copy = []; // array for send copy
    public hidden_copy = []; // array for send hidd copy
    public subject = ''; // subject

    public files_for_view = []; // имена файлов для HTML
    // public formData = new FormData(); // дата для отправки на серв файлов
    public tmp_name;
    public open_select_address = false;
    public save_tmp_state = false;
    public messages_sending = false;
    public important_tmp = false;
    public edit_template = false;
    public hidden_input_fields = true;
    public template_title: string;
    public important_template: boolean;
    public subscription_emailServ_template_list: Subscription;
    public new_template_name = true; // отображение имени шаблона ( в папке шаблоны )
    public new_tmp_state;
    public can_save_tmp;
    public save_draft_protest: Boolean = false;
    public draft_template_cashes: Array<{rough_id: number}> = [];





save_draft(data) {

  if (data === ''
  || data === null
  || this.edit_template === true
  || this.new_tmp_state === 'true'
  || this.save_draft_protest
  ) { // если пустая строка, и в шаблонах находимся
    // делаю выход чтобы не пулять пустой запрос
    this.save_draft_protest = false;
    return;
  }

  if (!this.id_for_draft) { // если id черновика не установлен

    const fields = this.creating_template_and_draft_fields();


    this.httpPost(
      `${global_params.ip}/mail/rough/create`,
      fields).subscribe((dataMails) => {
        this.id_for_draft = dataMails.roughId;
      });
  } else { // иначе обновляю существующий черновик
    const fields = this.creating_template_and_draft_fields();
    fields['roughId'] = +this.id_for_draft;
    this.httpPost(
      `${global_params.ip}/mail/rough/update`,
      fields).subscribe((dataMails) => {
      });

      if (this.status === 'draft') {
        this.draft_template_cashes.filter((val, ind, arr) => { // прохожусь по сохраненным черновикам
          if (val.rough_id === +this.id_for_draft) { // если есть совпадение с текущим id
             arr.splice(ind, 1);
          }
      });
      }


  }

}

delete_draft() { // при отправке письма удаляю его из черновиков

  this.httpPost(
    `${global_params.ip}/mail/rough/delete`,
    {roughId: +this.id_for_draft}).subscribe((dataMails) => {
    });

    this.emailServ.delete_draft_send_messages(+this.id_for_draft); // и чищу представление черновиков (если мы в них)
}



  ngOnInit() {


    this.from = this.emailServ.idPostForHTTP; // поле от кого по умолчанию

    this.subscription = this.activatedRoute.queryParams.subscribe( // передача параметров в новое сообщение (ответить, шаблон, создать и тд)
      (queryParam: any) => {
          this.hidden_input_fields = true;
          this.mail_id = queryParam['id']; // отлавливаю ID письма для последующего запроса (для шаблонов, ответить всем, ответить и тд)
          this.status = queryParam['status']; // статус - для работы с шаблонами
          this.edit_template = false;
          this.new_tmp_state = queryParam['new']; // для создания шаблонов
          this.can_save_tmp = queryParam['can_save']; // возможность сохранять шаблоны при добавлении новых из компонента template

          if (queryParam.edit_tmp === 'true') { // для дерева писем и редактирования шаблонов
            this.new_template_name = true; // показываем имя шаблона в папке шаблоны
            this.edit_template = true; // показываем иконку добавить в избранное (для шаблонов), кнопку новый шаблон, удалить шаблон
            this.hidden_input_fields = false; // прячем в спойлер "кому", "копия" и тд графы
            this.httpPost(
              `${global_params.ip}/mail/draft/`,
              {address: this.emailServ.idPostForHTTP, draftId: +this.mail_id}).subscribe((dataMails) => {

                this.important_template = dataMails[0].flagged; // звездочка, показывает избранный шаблон или нет
                this.template_title = dataMails[0].title; // имя шаблона
                this.to = [];
                this.copy = [];
                this.hidden_copy = []; // чистим графы кому и тд, от предыдущего шаблона

                this.messages_for_draft.reset();
                this.subject = '';
                if (dataMails[0].html === null) { // если html в письме нет - берем графу tetx
                  this.messages_for_draft.setValue(dataMails[0].text);

                 } else {
                  this.messages_for_draft.setValue(dataMails[0].html); // иначе парсим html
                 }
                 this.subject = dataMails[0].subject; // подставляем тему
                 if (dataMails[0].details && dataMails[0].details.recipients.to) {    // заполняем графы кому и тд если они есть в шаблоне
                 const newArray_to = [];                                             // по данным с сервера
                dataMails[0].details.recipients.to.filter(val => {
                  newArray_to.push(val.address);
                });

                this.to = newArray_to;
              }

              if (dataMails[0].details && dataMails[0].details.recipients.cc) {
                const newArray_copy = [];
                dataMails[0].details.recipients.cc.filter(val => {
                  newArray_copy.push(val.address);
                });
                this.copy = newArray_copy;
              }

              if (dataMails[0].details && dataMails[0].details.recipients.bcc) {
                const newArray_hidden_copy = [];
                dataMails[0].details.recipients.bcc.filter(val => {
                  newArray_hidden_copy.push(val.address);
                });
                this.hidden_copy = newArray_hidden_copy;
              }

              });

              this.subscription_emailServ_template_list = this.emailServ.draft_list_edited.subscribe(params => {
                if (params === true) { // подписался на изменение сервиса для того что бы менять звездочку в шаблонах из другого компонента
                    this.important_template = false;
                } else {
                  this.important_template = true;
                }
              });
              return;
          }

          if (this.status === 'template') { // шаблоны, добавление их в активное письмо
            this.httpPost(
              `${global_params.ip}/mail/draft/`,
              { draftId: +this.mail_id}).subscribe((dataMails) => {

                this.template_title = dataMails[0].title;
                // this.to = [];
                // this.copy = [];
                // this.hidden_copy = [];
                // this.messages = '';
                // this.subject = '';
                if (this.messages_for_draft.value === undefined ||
                  this.messages_for_draft.value === '') { // если данных нет, вставляем пустую строку
                    this.messages_for_draft.reset();
                }
                if (dataMails[0].html === null) { // если шаблон без html добавляем к телу активного письма содержимое шаблона
                  this.messages_for_draft.setValue( `${dataMails[0].text} <br>
                  ${this.messages_for_draft.value} `);

                 } else { // иначе добавляем текст

                  this.messages_for_draft.setValue(`${dataMails[0].html}  <br>
                  ${this.messages_for_draft.value}`)  ;
                 }
                //  this.subject = dataMails[0].subject;

              //    if (dataMails[0].details && dataMails[0].details.recipients.to) {

              //   dataMails[0].details.recipients.to.filter(val => {
              //     this.to.push(val.address);
              //   });

              // }

              // if (dataMails[0].details && dataMails[0].details.recipients.cc) {

              //   dataMails[0].details.recipients.cc.filter(val => {
              //     this.copy.push(val.address);
              //   });

              // }

              // if (dataMails[0].details && dataMails[0].details.recipients.bcc) {
              //   dataMails[0].details.recipients.bcc.filter(val => {
              //     this.hidden_copy.push(val.address);
              //   });

              // }

              });
          }


          if (this.activatedRoute.snapshot.params.files && this.newMessageService.files.length) {
            this.add_drag_input_data(this.newMessageService.files);  // для прикрепления файлов из формы быстрого ответа
            this.mail_id = this.activatedRoute.snapshot.params.id;
            this.httpPost(
              `${global_params.ip}/mail/envelope/`,
              {address: this.emailServ.idPostForHTTP, mailId: +this.mail_id}).subscribe((dataMails) => {
                this.to = [dataMails.from_address];
                this.subject = `RE: ${dataMails.subject}`;
              });
          }

          if (this.status === 'reply') { // если нажали "ответить"
          this.new_template_name = false;
            this.httpPost(
              `${global_params.ip}/mail/envelope/`,
              {address: this.emailServ.idPostForHTTP, mailId: +this.mail_id}).subscribe((dataMails) => {
                this.to = [dataMails.from_address]; // вставляем поле кому ответить, отвечаем одному адресату
                this.subject = `RE: ${dataMails.subject}`;
                if (dataMails.html === null) {

                  this.messages_for_draft.setValue(`${dataMails.from_address} писал :
                  <blockquote type="cite"> ${dataMails.text} </blockquote>`);
                 } else { // ставим в цитату текст письма на который отвечаем
                  this.messages_for_draft.setValue(`${dataMails.from_address} писал :
                  <blockquote type="cite"> ${dataMails.html} </blockquote>`);
                 }
              });
          }

          if (this.status === 'reply_all') {  // ответить всем
            this.new_template_name = false;
            this.httpPost(
              `${global_params.ip}/mail/envelope/`,
              {address: this.emailServ.idPostForHTTP, mailId: +this.mail_id}).subscribe((dataMails) => {

                this.subject = `RE: ${dataMails.subject}`;
                const newArray = [];
                dataMails.details.recipients.to.filter(val => { // пробегаемся по всем кто в копии
                  if (val.address !== this.emailServ.idPostForHTTP) {
                    newArray.push(val.address); // добавляем их в массив, исключая свой собственный адрес
                  }
                });

                this.to = newArray;
                this.to.push(dataMails.from_address); // добавляем к адресатам в ответе того, от кого пришло письмо

                if (dataMails.html === null) {
                  this.messages_for_draft.setValue(`${dataMails.from_address} писал :
                  <blockquote> ${dataMails.text} </blockquote>`);
                 } else {
                  this.messages_for_draft.setValue(`${dataMails.from_address} писал :
                  <blockquote> ${dataMails.html} </blockquote>`);
                 }
              });
          }

          if (this.status === 'forward') { // если нажали переслать
            this.new_template_name = false;
            this.httpPost(
              `${global_params.ip}/mail/envelope/`,
              {address: this.emailServ.idPostForHTTP, mailId: +this.mail_id}).subscribe((dataMails) => {
                this.subject = `${dataMails.subject}`;
                if (dataMails.html === null) {
                  this.messages_for_draft.setValue(dataMails.text); // просто берем содержимое письма и тему
                 } else {
                  this.messages_for_draft.setValue(dataMails.html);
                 }
              });
          }

          if  (this.status === undefined) { // если без параметров, просто пустое письмо (на ф-ю Новое письмо)
            this.clear_msg();
          }

          if (this.new_tmp_state === 'true') { // если зашли из шаблонов в новый шаблон - колбаса "кому" и тд появляется, скрывается
                                                                                                              // "Название шаблона"
            this.edit_template = false;
            this.hidden_input_fields = false;
            this.new_template_name = false;

          }


          if (this.status === 'create_tmp') { // функция из входящего (или другого любого письма) сделать шабло
            this.httpPost(
              `${global_params.ip}/mail/envelope/`,
              {address: this.emailServ.idPostForHTTP, mailId: +this.mail_id}).subscribe((dataMails) => {



                if (dataMails.html === null) {
                  this.messages_for_draft.setValue(dataMails.text);
                 } else {
                  this.messages_for_draft.setValue(dataMails.html);
                 }
              });
          }

          if (this.status === 'draft') { // черновики, добавление их в активное письмо
                this.clear_msg();
                this.save_draft_protest = true;
                this.id_for_draft = this.mail_id; // сразу получаю id текущего черновика,
                                                  // что бы находясь в компоненте обновлять их а не создавать новые
                let draft_flagged = true;
                this.draft_template_cashes.filter(val => { // прохожусь по сохраненным черновикам
                    if (val.rough_id === +this.id_for_draft) { // если есть совпадение с текущим id
                        draft_flagged = false; // отменяю дальнейший запрос
                        this.add_fields_draft(val); // вставляю поля для черновика
                    }
                });


            if (draft_flagged) { // если совпадений нет, пуляю запрос и заполняю поля из ответа с сервера
            this.httpPost(
              `${global_params.ip}/mail/rough/`,
              { roughId: +this.mail_id}).subscribe((dataMails) => {
                this.draft_template_cashes.push(dataMails); // добавляю письмо в кэш

                this.add_fields_draft(dataMails);

              });
            }
          }



      }
  );

  }


  add_fields_draft(object_for_add) { // ф-я для заполнения полей в черновиках
    if (this.messages_for_draft.value === undefined ||
      this.messages_for_draft.value === '') { // если данных нет, вставляем пустую строку, обнуляя форму
        this.messages_for_draft.reset();
    }
    if (object_for_add.html === null) { // если шаблон без html добавляем к телу активного письма содержимое шаблона
      this.messages_for_draft.setValue(`${object_for_add.text}`);

     } else { // иначе добавляем текст

      this.messages_for_draft.setValue(`${object_for_add.html}`);
     }

     this.subject = object_for_add.subject;

     if (object_for_add.details && object_for_add.details.recipients.to) {

    object_for_add.details.recipients.to.filter(val => {
      this.to.push(val.address);
    });

  }

  if (object_for_add.details && object_for_add.details.recipients.cc) {

    object_for_add.details.recipients.cc.filter(val => {
      this.copy.push(val.address);
    });

  }

  if (object_for_add.details && object_for_add.details.recipients.bcc) {
    object_for_add.details.recipients.bcc.filter(val => {
      this.hidden_copy.push(val.address);
    });

  }
  }


  ngDoCheck() {
    // console.log(this.draft_template_cashes);
  }

  public httpPost(url: string, body, options?): Observable<any> {
    return this.http.post(url, body, {headers: {Authorization: `Bearer ${this.authorizationServ.accessToken}`}});
  }

  clear_msg() { // очистка заполнения письма
                this.to = [];
                this.copy = [];
                this.hidden_copy = [];
                this.messages_for_draft.reset();
                this.subject = '';
                this.edit_template = false; // скрываем графы редактирования шаблона (если включены)
                this.new_template_name = false;
  }

  add_data(arr, e) { // срабатывает по блюру, функция принимает массив для работы - добавление баблов
      if (e.target.value === undefined || e.target.value === '') { // если пустая строка - выхожу
        return;
      }

      const validation_flag = this.validation(e.target.value);
      if (validation_flag === false) {
        return;
      }
      arr.push(e.target.value); // добавляю в массив значение с таргета
      arr.filter((val, ind, self) => {
        if (self.indexOf(val) !== ind) { // если такое значение уже есть в массиве (бабл уже создан)
          arr.pop(); // удаляю последнее добавленное push'ем значение
          this.showError('Адрес уже есть');
        }});
      e.target.value = ''; // чищу значение с таргета
  }
  add_data_keyEvent(arr,  e) { // срабатывает при клике на Enter, функция принимает массив для работы, действие аналогично ф-ии сверху
    if (e.key === 'Backspace' && e.target.value === '') { // если нажали на backspace - удалили последний
      arr.pop();
      return;
    }
    if (e.key === 'Enter' && e.target.value !== '') { // отлавливаю клик на Enter

      const validation_flag = this.validation(e.target.value);
      if (validation_flag === false) {
        return;
      }
      // const new_data = {address: e.target.value}
      arr.push(e.target.value);
      arr.filter((val, ind, self) => {
        if (self.indexOf(val) !== ind) {
          arr.pop();
          this.showError('Адрес уже есть');
        }});
      e.target.value = '';
    }
  }

  validation(val) { // ф-я валидатор, проверяет введенные значения
    const regExsp = /[а-яё]/i; // регулярка на русские символы
      if (val.indexOf('@') < 0 || // если нет @
      val.search(regExsp) >= 0 || // если есть русские символы
      val.indexOf('!') > 0 // если есть  знак !
       ) {
        this.showError('Введите корректный адрес (en + @)');
        return false;
      }
  }

  delete_data_clickEvent(arr, e, index) { // удаление при клике на крестик в бабле
    arr.splice(index, 1); // удалили по текущему индексу в массиве
  }

  showError(param) { // тосты уведомления
    this.toastrServ.error(param);
  }
  show_notification(param) {
    this.toastrServ.show(param);
  }
  showSuccess(param) {
    this.toastrServ.success(param);
  }


  closeViewer() {
const navigatePath = this._rout.url.replace(/\/create.*/, ''); // стартовый урл, если закрыли окно нового сообщения
const queryParams = Object.assign({}, this.activatedRoute.snapshot.queryParams);
if (this.emailServ.lettersList) {
this.emailServ.lettersList.filter(val => {
  if (val.mail_id === this.emailServ.currentId) {
    queryParams['imp_flag'] =  val.flagged;
  }
});
}
this._rout.navigate([navigatePath], { relativeTo: this.activatedRoute,  // передача queryParams из компонента
queryParams: queryParams, replaceUrl: true }); // перехожу по урлу

  }


  sendMessage() {
    const formData = new FormData; // создаю объект new FormData
    this.messages_sending = true; // включаю крутилку прелоадер что письмо отправляется
  for (let i = 0; i < this.files_for_view.length; i++) { // добавляю в форм дэйт циклом файлы с письма
    formData.append('files', this.files_for_view[i]);
}


  formData.append('json', JSON.stringify({ // добавляю json с необходимыми полями
    from: [
      {address: this.from}
    ],
    to: this.to.map(val => { // из массива с адресами делаю объекты address: some@mail.ru
      return {
        address: val
      };
    })
    ,
    cc: this.copy.map(val => {
      return {
        address: val
      };
    })
    ,
    bcc: this.hidden_copy.map(val => {
      return {
        address: val
      };
    })
    ,
    subject: this.subject,
    html: this.messages_for_draft.value // отправляем пиьма как html документ
  }));


  this.httpPost(`${global_params.ip}/mail/envelope/send`, formData).subscribe(
    (resp => { // если ответ положительный, отключаю прелоадер, возвращаюсь на урл с которого отправили


        this.closeViewer(); // функция сбрасывает урл и ловит папаметр для отображения важное / не важное письмо
        this.messages_sending = false; // крутилка off
        this.showSuccess('Письмо отправлено');
        if (!this.emailServ.counts[this.from][2]) {
          this.emailServ.counts[this.from][2] = 1; // counter для счетчика отправленных писем
        } else {
          this.emailServ.counts[this.from][2] = +this.emailServ.counts[this.from][2] + 1;
        }
        this.save_draft_protest = true; // если отправили раньше чем сохранили в черновики, отменяем сохранение
        this.delete_draft();

    }),
(err: HttpErrorResponse) => { // если ошибка
  this.showError('Письмо НЕ отправлено');
  this.messages_sending = false; // выключаю крутилку
});





}
onFileChange(event) { // прикрепление файлов с инпута
  const files  = event.target.files; // отловил файлы прикрепления
  this.add_drag_input_data(files); // отправляю файлы в функцию
}


dragStart(e) { // drag'n'drop функцию прикрепления файлов
  e.preventDefault();


  const hidden_drag_region = document.querySelector('.drag_region');
  hidden_drag_region.classList.add('open'); // показываю пунктирную drag область
}
dragEnd(e) { // когда событие драга завершилось
  e.preventDefault();

  const hidden_drag_region = document.querySelector('.drag_region');
  hidden_drag_region.classList.remove('open'); // удаляю активную область

}
drop(e) {
  e.preventDefault();
  e.stopPropagation();


  const hidden_drag_region = document.querySelector('.drag_region');
  hidden_drag_region.classList.remove('open');
  this.newMessageService.files = e.dataTransfer.files; // беру файлы с дропа
  this.add_drag_input_data(this.newMessageService.files); // пускаю их в функцию
}

delete_attach(index) { // удаляю прикрепленный файл по его индексу в массиве файлов
  this.files_for_view.splice(index, 1);
}


add_drag_input_data(objForData) { // ф-я принимает объект с файлом
  // console.log(obj)
  const newArray = [objForData]; // засунул в массив для работы

  newArray.map((val) => {
 // tslint:disable-next-line:forin
  for (const key in val) { // пробегаюсь по файлам в массиве
    if (val[key].name !== 'item' && val[key].name !== undefined) { // если имя файла не item и und
    this.files_for_view.push(val[key]); // добавляю в массив с файлами
    }
  }

});



}
// ШАБЛОНЫ СОХРАНЯЕМ ************************************ //

creating_template_and_draft_fields() {
  const to_send = this.to.map(val => { // массив с графами "кому" привожу к виду {addr:some@}
    return {address: val};
});
  const cc_send = this.copy.map(val => { // массив с графами "копия"
    return {address: val};
});
const bcc_send = this.hidden_copy.map(val => { // массив с графами "Скрытая копия"
  return {address: val};
});

  const object_for_template_list = {
    address: this.from, // имейл кто создал шаблон
    title: this.tmp_name, // имя шаблона
    text: null, // текст не отправляем
    html: this.messages_for_draft.value, // поле с текстом шаблона (или его html)
    subject: this.subject || null, // либо есть либо Null
    flagged: this.important_tmp || null, // флаг (тру фолс)
    recipients: {
    from: [
      {address: this.from,
      }
    ],
   to: to_send,
   cc: cc_send,
   bcc: bcc_send
  }
  };

  return object_for_template_list;
}



open_save_template() {
this.save_tmp_state = ! this.save_tmp_state; // открываю интерфейс создания шаблона (введите имя)
this.important_tmp = false; // снимаю флаг важное, если осталось с предыдущего раза
}

cancel_template() {
  this.save_tmp_state = false; // закрываю интерфейс создания шаблона
}

toggle_important_flag() {
    this.important_tmp = ! this.important_tmp; // переключаю флаг сохранить как избранный шаблон или нет
}
save_template() { // функция фохранения шаблона

  if (this.tmp_name === '' || this.tmp_name === undefined) { // если не задано имя для шаблона, выкину с ошибкой
    this.showError('Введите имя шаблона');
    return;
  }
  this.save_tmp_state = false; // закрыть поле ввода имени шаблона

  const fields = this.creating_template_and_draft_fields();

  this.httpPost(
    `${global_params.ip}/mail/draft/create`,
    // tslint:disable-next-line:max-line-length
    fields).subscribe((data) => {

      fields['draft_id'] = data.draftId;
      this.emailServ.draft_list.push(fields);

    });
  this.tmp_name = ''; // очищаю инпут после сохранения шаблона
  this.show_notification('Шаблон создан');

}

// *************************************************************************

select_new_address(e) { // выбор с какого ящика отправляем письмо
  if (e.target.classList.contains('select_btn') || e.target.classList.contains('la-angle-down')) { //
      this.open_select_address = ! this.open_select_address; // если нажали стрелочку - всплывающее меню
  }
  if (e.target.classList.contains('select_li')) { // если выбрали какой то адрес
      this.from = e.target.innerText; // вставляю его текст
      this.open_select_address = false; // закрываю окно выбора
  }
}

show_babl_menu(e) {
  if (e.target.classList.contains('babl__menu') || e.target.classList.contains('babl__menu_btn') ||
  e.target.classList.contains('babl_inp')) { // если клик не по баблу - выхожу
      return;
  }
  const all_bables = document.querySelectorAll('.babl__menu'); // ловлю скрытое меню всех баблов
  const target_babl = e.target.closest('.new_message__bables'); // ловлю бабл который кликнули
  const target_babl_menu = target_babl.querySelector('.babl__menu'); // ловлю его меню
  if (!target_babl_menu.classList.contains('visible')) { // если меню скрыто
    for (let key = 0; key < all_bables.length; key++) {
      all_bables[key].classList.remove('visible'); // скрываю все остальные
      }
    target_babl_menu.classList.add('visible'); // делаю активный бабл видимым
  } else {
    for (let key = 0; key < all_bables.length; key++) {
      all_bables[key].classList.remove('visible'); // иначе просто скрываю все остальные
      }
  }


}
edit_babl_open(e) { // клик по кнопке всплывающего меню
      const target_babl = e.target.closest('.new_message__bables'); // таргет клика
      const target_babl_name = target_babl.querySelector('.babl_name'); // получаю имя бабла
      const target_babl_input = target_babl.querySelector('.babl_inp'); // получаю инпут для ввода в бабле

      target_babl_name.classList.add('hide'); // в текущем меню скрываю имя,
      target_babl_input.classList.remove('hide'); // показываю бабл для изменения инфо
      const babl__menu_visibl = document.querySelector('.babl__menu.visible');
      babl__menu_visibl.classList.remove('visible');  // скрываю меню
}

edit_babl(e, index, array_for_edit) { // изменение бабла через инпут
  if (e.target.value === '') { // если очистили инпут бабла - удаляю его из массива
    array_for_edit.splice(index, 1);
    return;
  }
  const regExsp = /[а-яё]/i;
  if (e.target.value.indexOf('@') < 0 || e.target.value.search(regExsp) >= 0) { // валидация
    this.showError('Введите корректный адрес (en + @)');
    cancel_babl_edit();
    e.target.value = array_for_edit[index]; // val инпута восстанавливаю к первоначальному (для повторного edit)
    return;
  }

  // у инпута уже вставлены поля, берется из Html

  array_for_edit[index] = e.target.value; // если валидация прошла - меняю массив со значениями
  cancel_babl_edit();




  function cancel_babl_edit() {
    const babl_name = document.querySelectorAll('.new_message__bables p');
      const babl_inp = document.querySelectorAll('.new_message__bables input');
      for (let key = 0; key < babl_name.length; key++) {
        babl_name[index].classList.remove('hide'); // если не правильный ввод скрываю инпут и показываю имя (первоначальное)
        babl_inp[index].classList.add('hide');
      }
  }
}

send_and_save_tmp(e) { // сохраняет изменения в текущий шаблон доступно из шаблонов (status: template) в параметрах

  const to_send = this.to.map(val => { // массив с графами "кому"
  return {address: val};
});
const cc_send = this.copy.map(val => { // массив с графами "копия"
  return {address: val};
});
const bcc_send = this.hidden_copy.map(val => { // массив с графами "Скрытая копия"
return {address: val};
});
this.httpPost(
  `${global_params.ip}/mail/draft/update`,
  // tslint:disable-next-line:max-line-length
  {address: this.from, // имейл
    draftId: +this.mail_id,
    html: this.messages_for_draft.value,
    subject: this.subject,
    recipients: {
    from: [
      {address: this.from,
      }
    ],
   to: to_send,
   cc: cc_send,
   bcc: bcc_send
  }
  }).subscribe(() => {
    this.showSuccess('Изменения сохранены');
  });
}

toggle_inputs_field(bool) { // скрыть / показать поля ввода кому, копия и тд (для шаблона)
  this.hidden_input_fields = bool;
}
}

