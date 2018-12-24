import { Component, OnInit, Inject, Input, DoCheck, Output, EventEmitter} from '@angular/core';
import { EmailServiceService } from '../../email-service.service';
import { HttpClient } from '@angular/common/http';
import { Observable} from 'rxjs';
import { tokenKey } from '@angular/core/src/view';

@Component({
  selector: 'app-folders-list',
  templateUrl: './folders-list.component.html',
  styleUrls: ['./folders-list.component.scss']
})
export class FoldersListComponent implements OnInit, DoCheck {

  @Input() mail_id;  // id ящика
  @Input() all_folders; // все папки
  @Input() selected_mail_id; // выбранные айдишки писем в массиве
  @Input() state_open; // открыт закрыт компонент
  @Input() token; // токен авторизации
  @Output() state_folders_change = new EventEmitter(); // отправка события родителю


  constructor(
    @Inject(EmailServiceService) public emailServ: EmailServiceService,
    private http: HttpClient
  ) { }

  ngOnInit() {

    this.all_folders = this.all_folders.filter(val => val.address === this.mail_id // ловлю папки открытого ящика
    ).map(item => {
      return item.boxes.filter(val => val.id === 1).map(item2 => item2.childs) [0][0] || []; // чилды входящих
   });
  }

  ngDoCheck() {
  }

  public httpPost(url: string, body, options?): Observable<any> {
    return this.http.post(url, body, {headers: {Authorization: `Bearer ${this.token}`}});
  }

  change_folder(e) {
    this.state_open = false; // прячу компонент
    this.state_folders_change.next(this.state_open); // отправляю событие на скрытие компонента

    const target = e.target; // ловлю на какой папке был клик
    const id_folder = target.getAttribute('id'); // ловлю ее id
    this.selected_mail_id.filter(val => {
        this.httpPost(`${this.emailServ.ip}/mail/setbox`, {
      mailId: +val, // кидаю ID-шники
      boxId: +id_folder, // id папки
      address: this.emailServ.idPostForHTTP
    }).subscribe();
    this.emailServ.lettersList = this.emailServ.lettersList.filter((val2 , ind) => {
      if (+val2.mail_id !== +val) {
        return val2; // чищу представление
      }
      });
    });
      this.emailServ.hideAvatars = []; // чтоб инпуты работали
      this.emailServ.idLetters = []; // обнуляю корзину на удаление
      this.emailServ.checkerTrash(); // убираю иконку (иначе инпуты глючат)

  }


}