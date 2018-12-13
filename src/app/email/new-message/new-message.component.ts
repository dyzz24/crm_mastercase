import { Component, OnInit, Input, DoCheck, Inject, HostListener } from '@angular/core';
import { EmailServiceService } from '../email-service.service';
import { Router } from '@angular/router';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthorizationService } from '../../authorization.service';
import { ToastrService} from 'ngx-toastr';



@Component({
  selector: 'app-new-message',
  templateUrl: './new-message.component.html',
  styleUrls: ['./new-message.component.scss']
})
export class NewMessageComponent implements OnInit, DoCheck {
  constructor(
    @Inject(EmailServiceService) public emailServ: EmailServiceService,
    private _rout: Router,
    private http: HttpClient,
    @Inject(ToastrService) private toastrServ: ToastrService,
    @Inject(AuthorizationService) private authorizationServ: AuthorizationService
    ) {
     }

private from;
private to = [this.emailServ.to_answer]; // array for send
private copy; // array for send
private hidden_copy = []; // array for send
private subject = this.emailServ.to_subject; // тема для отправки

private messages;
private messages_sending = false;
private files; // файлы с инпута
private files_for_view; // имена файлов для HTML
private formData = new FormData(); // дата для отправки на серв файлов


  ngOnInit() {
    this.emailServ.hiddenEmpty = true;
    this.copy = this.emailServ.to_all_answer;
  }
  ngDoCheck() {

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

  delete_data_keyEvent(arr, e) { // удаление при клике на Backspace
    if (e.key === 'Backspace' && e.target.value === '') {
      arr.pop();
    }
  }
  delete_data_clickEvent(arr, e, index) { // удаление при клике на крестик в бабле
    arr.splice(index, 1); // удалили по текущему индексу
  }

  showError(param) {
    this.toastrServ.error(param);
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
  //   this.httpPost(
  //     `${this.emailServ.ip}/mail/send`,
  //     // tslint:disable-next-line:max-line-length
  //     { subject: this.subject, text: this.messages, html: this.messages, to: this.to}).subscribe((data) => {
  // });
  this.formData.append('json', JSON.stringify({
    from: [
      {address: this.emailServ.idPostForHTTP}
    ],
    to: [
      {
        address: this.to
      }
    ],
    subject: this.subject,
    html: this.messages
  }));

  this.httpPost(`${this.emailServ.ip}/mail/send`, this.formData).subscribe(resp => {

});


this.messages_sending = true;
setTimeout(() => {
  const navigatePath = this._rout.url.replace(/\/create.*/, ''); // стартовый урл
    this._rout.navigate([navigatePath]);
  this.messages_sending = false;
  this.emailServ.hiddenEmpty = false;
  this.showSuccess('Письмо отправлено');
}, 3000);
}
onFileChange(event) {
  this.files = event.target.files; // отловил файлы прикрепления
  this.add_drag_input_data(this.files);
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

  this.files = e.dataTransfer.files;
  this.add_drag_input_data(this.files);
}



add_drag_input_data(objForData) {
  this.files_for_view = [objForData]; // засунул в массив для работы
    const temp_arr = []; // временный массив
    this.files_for_view.map((val) => {

 // tslint:disable-next-line:forin
  for (const key in val) { // пробегаюсь по файлам
    if (val[key].name !== 'item' && val[key].name !== undefined) { // если имя файла не item и und

    temp_arr.push(val[key]); // пушу в массив
    }
  }
  this.files_for_view = temp_arr; // приравниваю к временному массиву для отображения в HTML
});


  for (let i = 0; i < objForData.length; i++) {
       this.formData.append('files', objForData[i]);

  }
//   this.httpPost(`${this.emailServ.ip}/mail/send`, this.formData).subscribe(resp => {

// });
}



}
