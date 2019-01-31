import { Component, OnInit, Input, DoCheck, Inject, inject } from '@angular/core';
import { EmailServiceService } from '../email-service.service';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { AuthorizationService } from '../../authorization.service';
import { ToastrService} from 'ngx-toastr';
import { ReadVarExpr } from '@angular/compiler';
import {NewMessageService} from '../new-message/new-message.service';
import { DatePipe } from '@angular/common';
import { isDate } from '@angular/common/src/i18n/format_date';




@Component({
  selector: 'app-new-message',
  templateUrl: './new-message.component.html',
  styleUrls: ['./new-message.component.scss']
})
export class NewMessageComponent implements OnInit, DoCheck {

  private babl_menu_show = [];
  constructor(
    @Inject(EmailServiceService) public emailServ: EmailServiceService,
    private _rout: Router,
    private http: HttpClient,
    @Inject(ToastrService) private toastrServ: ToastrService,
    @Inject(AuthorizationService) private authorizationServ: AuthorizationService,
    @Inject(NewMessageService) private newMessageService: NewMessageService,
    private activatedRoute: ActivatedRoute
    ) {
     }
     public from;
     private mail_id; // del
     private status; // del
     subscription: Subscription;

    public to = []; // array for send
    public copy = []; // array for send copy
    public hidden_copy = []; // array for send hidd copy
    public subject = ''; // subject
    public messages;
    public files_for_view = []; // имена файлов для HTML
    public formData = new FormData(); // дата для отправки на серв файлов
    public tmp_name;
    public open_select_address = false;
    public save_tmp_state = false;
    public messages_sending = false;
    public important_tmp = false;
    edit_template = false;
    public template_title: string;
    public important_template: boolean;
    public subscription_emailServ_template_list: Subscription;





  ngOnInit() {
    this.emailServ.hiddenEmpty = true;
    this.save_tmp_state = false; // открытие закрытие окна сохранения имени шаблона
    this.from = this.emailServ.idPostForHTTP;


    // if (this.newMessageService.files.length > 0) { // если стэйт сервиса не пуст

    //   this.files_for_view = this.newMessageService.files; // загоняет в файлы для отправки
    // }
    this.subscription = this.activatedRoute.queryParams.subscribe( // передача параметров в новое сообщение (ответить и тд)
      (queryParam: any) => {
          this.mail_id = queryParam['id'];
          this.status = queryParam['status'];
          if (queryParam.edit_tmp === 'true') { // для колбасины и редактирования шаблонов
            this.edit_template = true;

            this.httpPost(
              `${this.emailServ.ip}/mail/draft`,
              {address: this.emailServ.idPostForHTTP, id: this.mail_id}).subscribe((dataMails) => {
                this.important_template = dataMails[0].flagged;

                this.template_title = dataMails[0].title;
                this.to = [];
                this.copy = [];
                this.hidden_copy = [];
                this.messages = '';
                this.subject = '';
                if (dataMails.html === null) {
                  this.messages = dataMails[0].text;

                 } else {
                  this.messages = dataMails[0].html;

                 }
                 this.subject = dataMails[0].subject;

                 if (dataMails.details && dataMails[0].details.recipients.to) {
                 const newArray_to = [];
                dataMails[0].details.recipients.to.filter(val => {
                  newArray_to.push(val.address);
                });
                this.to = newArray_to;
              }

              if (dataMails.details &&  dataMails[0].details.recipients.cc) {
                const newArray_copy = [];
                dataMails[0].details.recipients.cc.filter(val => {
                  newArray_copy.push(val.address);
                });
                this.copy = newArray_copy;
              }

              if (dataMails.details &&  dataMails[0].details.recipients.bcc) {
                const newArray_hidden_copy = [];
                dataMails[0].details.recipients.bcc.filter(val => {
                  newArray_hidden_copy.push(val.address);
                });
                this.hidden_copy = newArray_hidden_copy;
              }

              });

              this.subscription_emailServ_template_list = this.emailServ.draft_list_edited.subscribe(params => {
                if (params === true) { // подписался на изменение сервиса для того что бы менять звездочку в шаблонах
                    this.important_template = false;
                } else {
                  this.important_template = true;
                }
              });
              return;
          }

          if (this.status === 'template') {
            this.httpPost(
              `${this.emailServ.ip}/mail/draft`,
              {address: this.emailServ.idPostForHTTP, id: this.mail_id}).subscribe((dataMails) => {
                this.template_title = dataMails[0].title;
                this.to = [];
                this.copy = [];
                this.hidden_copy = [];
                // this.messages = '';
                this.subject = '';
                if (dataMails.html === null) {
                  // this.messages = dataMails[0].text;

                              this.messages =   `${dataMails[0].text} <br>
                               <blockquote type="cite"> ${this.messages} </blockquote>`;

                 } else {
                  // this.messages = dataMails[0].html;

                            this.messages =   `${dataMails[0].html}  <br>
                            <blockquote type="cite"> ${this.messages} </blockquote>`;

                 }
                 this.subject = dataMails[0].subject;

                 if (dataMails.details && dataMails[0].details.recipients.to) {
                 const newArray_to = [];
                dataMails[0].details.recipients.to.filter(val => {
                  newArray_to.push(val.address);
                });
                this.to = newArray_to;
              }

              if (dataMails.details &&  dataMails[0].details.recipients.cc) {
                const newArray_copy = [];
                dataMails[0].details.recipients.cc.filter(val => {
                  newArray_copy.push(val.address);
                });
                this.copy = newArray_copy;
              }

              if (dataMails.details &&  dataMails[0].details.recipients.bcc) {
                const newArray_hidden_copy = [];
                dataMails[0].details.recipients.bcc.filter(val => {
                  newArray_hidden_copy.push(val.address);
                });
                this.hidden_copy = newArray_hidden_copy;
              }

              });
          }


          if (this.activatedRoute.snapshot.params.files && this.newMessageService.files.length) {
            this.add_drag_input_data(this.newMessageService.files);
            this.mail_id = this.activatedRoute.snapshot.params.id;
            this.httpPost(
              `${this.emailServ.ip}/mail/mail`,
              {address: this.emailServ.idPostForHTTP, mailId: this.mail_id}).subscribe((dataMails) => {
                this.to = [dataMails.from_address];
                this.subject = `RE: ${dataMails.subject}`;
              });
          }

          if (this.status === 'reply') {
            this.httpPost(
              `${this.emailServ.ip}/mail/mail`,
              {address: this.emailServ.idPostForHTTP, mailId: this.mail_id}).subscribe((dataMails) => {
                this.to = [dataMails.from_address];
                this.subject = `RE: ${dataMails.subject}`;
                if (dataMails.html === null) {

                  this.messages = `${dataMails.from_address} писал :
                  <blockquote type="cite"> ${dataMails.text} </blockquote>`;
                 } else {
                  this.messages = `${dataMails.from_address} писал :
                  <blockquote type="cite"> ${dataMails.html} </blockquote>`;
                 }
              });
          }

          if (this.status === 'reply_all') {
            this.httpPost(
              `${this.emailServ.ip}/mail/mail`,
              {address: this.emailServ.idPostForHTTP, mailId: this.mail_id}).subscribe((dataMails) => {

                this.subject = `RE: ${dataMails.subject}`;
                const newArray = [];
                dataMails.details.recipients.to.filter(val => {
                  if (val.address !== this.emailServ.idPostForHTTP) {
                    newArray.push(val.address);
                  }
                });

                this.to = newArray;
                this.to.push(dataMails.from_address);

                if (dataMails.html === null) {
                  this.messages = `${dataMails.from_address} писал :
                  <blockquote> ${dataMails.text} </blockquote>`;
                 } else {
                  this.messages = `${dataMails.from_address} писал :
                  <blockquote> ${dataMails.html} </blockquote>`;
                 }
              });
          }

          if (this.status === 'forward') {
            this.httpPost(
              `${this.emailServ.ip}/mail/mail`,
              {address: this.emailServ.idPostForHTTP, mailId: this.mail_id}).subscribe((dataMails) => {
                this.subject = `${dataMails.subject}`;
                if (dataMails.html === null) {
                  this.messages = dataMails.text;
                 } else {
                  this.messages = dataMails.html;
                 }
              });
          }

          if  (this.status === undefined) {
              this.to = [];
                this.copy = [];
                this.hidden_copy = [];
                this.messages = '';
                this.subject = '';
                this.edit_template = false;
          }



      }
  );

  }
  ngDoCheck() {
    // console.log(this.files_for_view);
  }

  public httpPost(url: string, body, options?): Observable<any> {
    return this.http.post(url, body, {headers: {Authorization: `Bearer ${this.authorizationServ.accessToken}`}});
  }

  add_data(arr, e) { // срабатывает по блюру, функция принимает массив для работы
      if (e.target.value === undefined || e.target.value === '') { // если пустая строка - выхожу
        return;
      }
      if (arr[0] === '' || arr[0] === undefined) { // если первый элемент  = ''
                          // (такое бывает, когда нажимаю создать новое письмо, ибо передает '' от сервиса), удаляю его
          arr.shift();
      }
      const regExsp = /[а-яё]/i; // регулярка для проверки русских символов
      if (e.target.value.indexOf('@') < 0 || e.target.value.search(regExsp) >= 0) { // если в троке есть @ или русский символ
        this.showError('Введите корректный адрес (en + @)'); // выдаст сообщение
        return;
      }
      arr.push(e.target.value); // добавляю в массив значение с таргета
      arr.filter((val, ind, self) => {
        if (self.indexOf(val) !== ind) { // если такое значение уже есть в массиве
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
      if (arr[0] === '' || arr[0] === undefined) {
        arr.shift();
      }
      const regExsp = /[а-яё]/i;
      if (e.target.value.indexOf('@') < 0 || e.target.value.search(regExsp) >= 0) {
        this.showError('Введите корректный адрес (en + @)');
        return;
      }
      arr.push(e.target.value);
      arr.filter((val, ind, self) => {
        if (self.indexOf(val) !== ind) {
          arr.pop();
          this.showError('Адрес уже есть');
        }});
      e.target.value = '';
    }
  }

  delete_data_clickEvent(arr, e, index) { // удаление при клике на крестик в бабле
    arr.splice(index, 1); // удалили по текущему индексу
  }

  showError(param) {
    this.toastrServ.error(param);
  }
  show_notification(param) {
    this.toastrServ.show(param);
  }


  closeViewer() {
    this.emailServ.hiddenEmpty = false;
    const navigatePath = this._rout.url.replace(/\/create.*/, ''); // стартовый урл
    this._rout.navigate([navigatePath]);
  }

  showSuccess(param) {
    this.toastrServ.success(param);
  }

  sendMessage() {
    this.messages_sending = true; // крутилка on
  for (let i = 0; i < this.files_for_view.length; i++) { // добавляю в форм дэйт циклом
    this.formData.append('files', this.files_for_view[i]);
}


  this.formData.append('json', JSON.stringify({
    from: [
      {address: this.from}
    ],
    to: [
      {
        address: this.to
      }
    ],
    copy: [{
      address: this.copy
    }],
    hidden_copy: [{
      address: this.hidden_copy
    }],
    subject: this.subject,
    html: this.messages
  }));

  this.httpPost(`${this.emailServ.ip}/mail/send`, this.formData).subscribe(resp => {
});


setTimeout(() => {
  const navigatePath = this._rout.url.replace(/\/create.*/, ''); // стартовый урл
    this._rout.navigate([navigatePath]);
  this.messages_sending = false; // крутилка off
  this.emailServ.hiddenEmpty = false;
  this.showSuccess('Письмо отправлено');
}, 3000);
}
onFileChange(event) {
  const files  = event.target.files; // отловил файлы прикрепления
  this.add_drag_input_data(files);
}


dragStart(e) {
  e.preventDefault();


  const hidden_drag_region = document.querySelector('.drag_region');
  hidden_drag_region.classList.add('open');
}
dragEnd(e) {
  e.preventDefault();

  const hidden_drag_region = document.querySelector('.drag_region');
  hidden_drag_region.classList.remove('open');

}
drop(e) {
  e.preventDefault();
  e.stopPropagation();


  const hidden_drag_region = document.querySelector('.drag_region');
  hidden_drag_region.classList.remove('open');
  this.newMessageService.files = e.dataTransfer.files;
  this.add_drag_input_data(this.newMessageService.files);
}

delete_attach(index) {
  this.files_for_view.splice(index, 1);
}


add_drag_input_data(objForData) {
  // console.log(obj)
  const newArray = [objForData]; // засунул в массив для работы

  newArray.map((val) => {
 // tslint:disable-next-line:forin
  for (const key in val) { // пробегаюсь по файлам
    if (val[key].name !== 'item' && val[key].name !== undefined) { // если имя файла не item и und
    this.files_for_view.push(val[key]);
    }
  }
});



}
// ШАБЛОНЫ СОХРАНЯЕМ ************************************ //
open_save_template() {
this.save_tmp_state = ! this.save_tmp_state;
this.important_tmp = false;
}

cancel_template() {
  this.save_tmp_state = false;
}

toggle_important_flag() {
    this.important_tmp = ! this.important_tmp;
}
save_template() {

  if (this.tmp_name === '' || this.tmp_name === undefined) {
    this.showError('Введите имя шаблона');
    return;
  }
  const to_send = this.to.map(val => { // массив с графами "кому"
    return {address: val};
});
  const cc_send = this.copy.map(val => { // массив с графами "копия"
    return {address: val};
});
const bcc_send = this.hidden_copy.map(val => { // массив с графами "Скрытая копия"
  return {address: val};
});
  this.save_tmp_state = false; // закрыть поле ввода имени шаблона
  this.httpPost(
    `${this.emailServ.ip}/mail/draft_create`,
    // tslint:disable-next-line:max-line-length
    {address: this.from, // имейл
      title: this.tmp_name,
      text: '',
      html: this.messages,
      subject: this.subject,
      flagged: this.important_tmp,
      from: [
        {address: this.from,
        }
      ],
     to: to_send,
     cc: cc_send,
     bcc: bcc_send
    }).subscribe(() => {});
  this.tmp_name = ''; // очищаю инпут после сохранения шаблона
  this.show_notification('Шаблон создан');

}

// *************************************************************************

select_new_address(e) {
  if (e.target.classList.contains('select_btn') || e.target.classList.contains('la-angle-down')) {
      this.open_select_address = ! this.open_select_address;
  }
  if (e.target.classList.contains('select_li')) {
      this.from = e.target.innerText;
      this.open_select_address = false;
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
    target_babl_menu.classList.add('visible'); // делаю его видимым
  } else {
    for (let key = 0; key < all_bables.length; key++) {
      all_bables[key].classList.remove('visible'); // иначе просто скрываю все остальные
      }
  }


}
edit_babl_open(e) {
      const target_babl = e.target.closest('.new_message__bables');
      const target_babl_name = target_babl.querySelector('.babl_name');
      const target_babl_input = target_babl.querySelector('.babl_inp');

      target_babl_name.classList.add('hide'); // в текущем меню скрываю имя,
      target_babl_input.classList.remove('hide');
      const babl__menu_visibl = document.querySelector('.babl__menu.visible'); // скрываю меню
      babl__menu_visibl.classList.remove('visible');
}

edit_babl(e, index, array_for_edit) {
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

send_and_save_tmp(e) {

//   if (e.target.className === 'save_templ send_mess') {
//   const to_send = this.to.map(val => { // массив с графами "кому"
//     return {address: val};
// });
//   const cc_send = this.copy.map(val => { // массив с графами "копия"
//     return {address: val};
// });
// const bcc_send = this.hidden_copy.map(val => { // массив с графами "Скрытая копия"
//   return {address: val};
// });
//   this.httpPost(
//     `${this.emailServ.ip}/mail/draft_update`,
//     // tslint:disable-next-line:max-line-length
//     {address: this.from, // имейл
//       id: this.mail_id,
//       html: this.messages,
//       subject: this.subject,
//       from: [
//         {address: this.from,
//         }
//       ],
//      to: to_send,
//      cc: cc_send,
//      bcc: bcc_send
//     }).subscribe(() => {});
//   this.sendMessage();
// } else {
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
  `${this.emailServ.ip}/mail/draft_update`,
  // tslint:disable-next-line:max-line-length
  {address: this.from, // имейл
    id: this.mail_id,
    html: this.messages,
    subject: this.subject,
    from: [
      {address: this.from,
      }
    ],
   to: to_send,
   cc: cc_send,
   bcc: bcc_send
  }).subscribe(() => {
    this.showSuccess('Изменения сохранены');
  });
}
}

