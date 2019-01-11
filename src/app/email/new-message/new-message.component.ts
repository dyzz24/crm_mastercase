import { Component, OnInit, Input, DoCheck, Inject, inject } from '@angular/core';
import { EmailServiceService } from '../email-service.service';
import { Router } from '@angular/router';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { AuthorizationService } from '../../authorization.service';
import { ToastrService} from 'ngx-toastr';
import { ReadVarExpr } from '@angular/compiler';
import {NewMessageService} from '../new-message/new-message.service';




@Component({
  selector: 'app-new-message',
  templateUrl: './new-message.component.html',
  styleUrls: ['./new-message.component.scss']
})
export class NewMessageComponent implements OnInit, DoCheck {

  private babl_menu_show = false;
  constructor(
    @Inject(EmailServiceService) public emailServ: EmailServiceService,
    private _rout: Router,
    private http: HttpClient,
    @Inject(ToastrService) private toastrServ: ToastrService,
    @Inject(AuthorizationService) private authorizationServ: AuthorizationService,
    @Inject(NewMessageService) private newMessageService: NewMessageService,
    ) {
     }
     public from;







  ngOnInit() {
    this.emailServ.hiddenEmpty = true;
    this.newMessageService.save_tmp_state = false;
    this.from = this.emailServ.idPostForHTTP;

    // this.copy = this.emailServ.to_cc;
    if (this.newMessageService.files.length > 0) { // если стэйт сервиса не пуст

      this.add_drag_input_data(this.newMessageService.files); // загоняет в файлы для отправки
    }

  }
  ngDoCheck() {
    // console.log(this.newMessageService.to);
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
    this.newMessageService.messages_sending = true; // крутилка on
  for (let i = 0; i < this.newMessageService.files_for_view.length; i++) { // добавляю в форм дэйт циклом
    this.newMessageService.formData.append('files', this.newMessageService.files_for_view[i]);
}


  this.newMessageService.formData.append('json', JSON.stringify({
    from: [
      {address: this.from}
    ],
    to: [
      {
        address: this.newMessageService.to
      }
    ],
    subject: this.newMessageService.subject,
    html: this.newMessageService.messages
  }));

  this.httpPost(`${this.emailServ.ip}/mail/send`, this.newMessageService.formData).subscribe(resp => {
});


setTimeout(() => {
  const navigatePath = this._rout.url.replace(/\/create.*/, ''); // стартовый урл
    this._rout.navigate([navigatePath]);
  this.newMessageService.messages_sending = false; // крутилка off
  this.emailServ.hiddenEmpty = false;
  this.showSuccess('Письмо отправлено');
}, 3000);
}
onFileChange(event) {
  this.newMessageService.files = event.target.files; // отловил файлы прикрепления
  this.add_drag_input_data(this.newMessageService.files);
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
  this.newMessageService.files_for_view.splice(index, 1);
}


add_drag_input_data(objForData) {
  // console.log(obj)
  const newArray = [objForData]; // засунул в массив для работы


  newArray.map((val) => {
 // tslint:disable-next-line:forin
  for (const key in val) { // пробегаюсь по файлам
    if (val[key].name !== 'item' && val[key].name !== undefined) { // если имя файла не item и und
    this.newMessageService.files_for_view.push(val[key]);
    }
  }
});



}

open_save_template() {
this.newMessageService.save_tmp_state = ! this.newMessageService.save_tmp_state;
}
save_template() {

  if (this.newMessageService.tmp_name === '' || this.newMessageService.tmp_name === undefined) {
    this.showError('Введите имя шаблона');
    return;
  }
  const to_send = this.newMessageService.to.map(val => { // массив с графами "кому"
    return {address: val, name: ''};
});
  const cc_send = this.newMessageService.copy.map(val => { // массив с графами "копия"
    return {address: val, name: ''};
});
const bcc_send = this.newMessageService.hidden_copy.map(val => { // массив с графами "Скрытая копия"
  return {address: val, name: ''};
});
  this.newMessageService.save_tmp_state = false; // закрыть поле ввода имени шаблона
  this.httpPost(
    `${this.emailServ.ip}/mail/draft`,
    // tslint:disable-next-line:max-line-length
    {address: this.from, // имейл
      name: this.newMessageService.tmp_name,
      text: '',
      html: this.newMessageService.messages,
      subject: this.newMessageService.subject,
      from: [
        {address: this.from,
          name: ''
        }
      ],
     to: to_send,
     cc: cc_send,
     bcc: bcc_send
    }).subscribe(() => {});
  this.newMessageService.tmp_name = ''; // очищаю инпут после сохранения шаблона
  this.show_notification('Шаблон создан');

}

select_new_address(e) {
  if (e.target.classList.contains('select_btn') || e.target.classList.contains('la-angle-down')) {
      this.newMessageService.open_select_address = ! this.newMessageService.open_select_address;
  }
  if (e.target.classList.contains('select_li')) {
      this.from = e.target.innerText;
      this.newMessageService.open_select_address = false;
  }
}

show_babl_menu(e, index) {
  if (e.target.classList.contains('babl__menu') || e.target.classList.contains('babl__menu_btn') ||
  e.target.classList.contains('inp')) { // если клик не по баблу - выхожу
      return;
  }
  const all_bables = document.querySelectorAll('.babl__menu'); // ловлю скрытое меню бабла

      for (let key = 0; key < all_bables.length; key++) {
        if (key === index) {
          all_bables[key].classList.toggle('visible'); // открываю-закрываю целевое меню
          continue;
        }
        all_bables[key].classList.remove('visible'); // скрываю все остальные
      }
}
edit_babl_open(index) {
      const babl_name = document.querySelectorAll('.new_message__bables p'); // ловлю имя бабла
      const babl_inp = document.querySelectorAll('.new_message__bables input'); // его инпут для изменения бабла
      for (let key = 0; key < babl_name.length; key++) {
        babl_name[index].classList.add('hide'); // в текущем меню скрываю имя,
        babl_inp[index].classList.remove('hide'); // открываю инпут для edit
      }
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




}

