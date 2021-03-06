import { Component, OnInit, Inject, Input, DoCheck, Output, EventEmitter, OnDestroy} from '@angular/core';
import { EmailServiceService } from '../../email-service.service';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription} from 'rxjs';
import { Router, ActivatedRoute} from '@angular/router';
import {global_params} from '../../../global';

@Component({
  selector: 'app-folders-list',
  templateUrl: './folders-list.component.html',
  styleUrls: ['./folders-list.component.scss']
})
export class FoldersListComponent implements OnInit, DoCheck, OnDestroy {

  @Input() mail_id;  // id ящика
  @Input() all_folders; // все папки
  @Input() selected_mail_id; // выбранные айдишки писем в массиве
  @Input() state_open; // открыт закрыт компонент список папок
  @Input() token; // токен авторизации
  @Output() state_folders_change = new EventEmitter(); // отправка события родителю для скрытия компонента папок

  constructor(
    @Inject(EmailServiceService) public emailServ: EmailServiceService,
    private http: HttpClient,
  ) { }

  ngOnInit() {


   this.all_folders = this.all_folders.filter(val => val.address === this.mail_id // ловлю папки открытого ящика
    ).map(item => {
      return item.boxes.filter(val => val.id === 1).map(item2 => item2.childs) [0] || []; // чилды входящих
   });


    // console.log(this.emailServ.selectedMess);
  }

  ngDoCheck() {
  }

  ngOnDestroy() {
    this.state_folders_change.next(); // отправляю событие на скрытие компонента

  }

  public httpPost(url: string, body, options?): Observable<any> {
    return this.http.post(url, body, {headers: {Authorization: `Bearer ${this.token}`}});
  }

  change_folder(e) {
    this.state_open = false; // прячу компонент
    this.state_folders_change.next(this.state_open); // отправляю событие на скрытие компонента

    const target = e.target.closest('.wrapper'); // ловлю на какой папке был клик
    if (target.className === 'wrapper non_activ') {
        return;
    }
    const id_folder = target.getAttribute('id'); // ловлю ее id
    this.selected_mail_id.filter(val => {
        this.httpPost(`${global_params.ip}/mail/envelope/update`, {
      mailId: +val, // кидаю ID-шники
      boxId: +id_folder, // id папки
      address: this.emailServ.idPostForHTTP
    }).subscribe();


    this.emailServ.lettersList = this.emailServ.lettersList.filter((val2 , ind) => {
      if (val2.mail_id === +val && val2.seen === false) { // ловлю непрочитанные письма (для счетчика писем у папок)
        const previous_folders_box_id = val2.box_id; // ловлю предыдущий бокс папки (откуда перенес)

        if (this.emailServ.counts[this.emailServ.idPostForHTTP][id_folder] === undefined) {
          this.emailServ.counts[this.emailServ.idPostForHTTP][id_folder] = 0;
        }
        this.emailServ.counts[this.emailServ.idPostForHTTP][id_folder] =
      +this.emailServ.counts[this.emailServ.idPostForHTTP][id_folder] + 1 ; // меняю счетчик папки в которую перенес
      this.emailServ.counts[this.emailServ.idPostForHTTP][previous_folders_box_id] =
      +this.emailServ.counts[this.emailServ.idPostForHTTP][previous_folders_box_id] - 1; // меняю счетчик папки из которой перенес
      }
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
