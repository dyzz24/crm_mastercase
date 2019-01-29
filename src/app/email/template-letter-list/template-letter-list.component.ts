import { Component, OnInit, Inject} from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthorizationService } from '../../authorization.service';
import { Observable, Subscription } from 'rxjs';
import {global_params} from '../../global';
import { EmailServiceService } from '../email-service.service';

@Component({
  selector: 'app-template-letter-list',
  templateUrl: './template-letter-list.component.html',
  styleUrls: ['./template-letter-list.component.scss']
})
export class TemplateLetterListComponent implements OnInit {

  subscription: Subscription;
  email_id; // имя ящика для запроса
  draft_list; // список шаблонов для колбасины -- ГЛАВНЫЙ ДЛЯ РАБОТЫ

  selected_checkbox_for_html = [];
  collections_inputs_element = [];
  id_selected_letter = [];

  toggle_flag = true;


  protectToCopy = false;
  succes_search_flag = false;
  not_succes_search_flag = false;
  draft_copy_search = [];

  constructor(
    @Inject(AuthorizationService) private authorizationServ: AuthorizationService,
    @Inject(EmailServiceService) public emailServ: EmailServiceService,
    private rout: Router,
    private http: HttpClient,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.subscription = this.activatedRoute.params.subscribe(params => {
      this.email_id = params.email_id;
      this.emailServ.idPostForHTTP = this.email_id;
      this.httpPost(
        `${global_params.ip}/mail/draft`,
        // tslint:disable-next-line:max-line-length
        {address: this.email_id}).subscribe((data) => {
          this.draft_list = data;
          console.log(this.draft_list);
        });
    });

  }



  public httpPost(url: string, body, options?): Observable<any> {
    return this.http.post(url, body, {headers: {Authorization: `Bearer ${this.authorizationServ.accessToken}`}});
  }

  select_letter(e, index, id) {
    if (e.target.checked) {
      this.selected_checkbox_for_html[index] = true;
      this.id_selected_letter = [...this.id_selected_letter, +id];
      this.id_selected_letter = this.id_selected_letter.filter(
        (val, ind, self) => {
          return self.indexOf(val) === ind;
        }
      );
    }
    if (!e.target.checked) {
      this.selected_checkbox_for_html[index] = false;
      this.id_selected_letter = this.id_selected_letter.filter(
        item => item !== +id
      );
    }
  }

  cancell_checked(e, index) {
    const allInputs = <any>document.querySelectorAll('.settings_checkbox');
          for (let i = 0; i <= allInputs.length - 1; i++) {
            if (index === i) {
              continue;
            }
            allInputs[i].checked = false;
          }
}


selected_all() {
  if (this.toggle_flag) {
  this._select();
} else {
  this.canc_select();
}

  this.toggle_flag = ! this.toggle_flag;

}

canc_select() { // отменяет выделение всех писем
  this.selected_checkbox_for_html = this.draft_list.map(val => val = false);
  this.id_selected_letter = [];
  const allInputs = <any>document.querySelectorAll('.avatar_checkboxes');
  for (const key of allInputs) {
      key.checked = false;
  }
}

_select() { // выделяет все письма
  this.selected_checkbox_for_html = this.draft_list.map(val => val = true);
  this.id_selected_letter = this.draft_list.map(val => val.draft_id);
  const allInputs = <any>document.querySelectorAll('.avatar_checkboxes');

  for (const key of allInputs) {
      key.checked = true;
  }
}


search_in_templates(data) {
  this.canc_select();
  if (this.protectToCopy === false) {
    this.draft_copy_search = this.draft_list; // сохраняю исходные письма и сношу флаг
    this.protectToCopy = true;
  }

  if (data === '') { // если инпут пустой
    this.draft_list = this.draft_copy_search; // вставляю исходный список писем
    this.protectToCopy = false; // разрешаю снова сохранять исходные письма
    this.draft_copy_search = []; // очищаю временный массив писем
    this.succes_search_flag = false;
    this.not_succes_search_flag = false;
    // this.filterError = false; // переключатель для "Письма не найдены" в html
    return;
  }

  const new_search_array = this.draft_copy_search.filter((val, ind) => {
    if (val.title && val.title.toLowerCase().indexOf(data) >= 0 ) { // сам поиск
      return val;
    }});

    if (new_search_array.length > 0) { // если совпадения есть
      this.draft_list = new_search_array;
      this.succes_search_flag = true;
    }

    if (new_search_array.length > 0) { // если совпадения есть
      this.draft_list = new_search_array;
      this.succes_search_flag = true;
      this.not_succes_search_flag = false;
    }

    if (new_search_array.length === 0) { // если совпадений нет
      this.draft_list = new_search_array;
      this.succes_search_flag = false;
      this.not_succes_search_flag = true;
    }
}



delete_one_tmp(id, e, index) {
  e.target.closest('.list__prev').classList.add('dellLetter'); // отловили парента - дали красивую анимашку
  this.cancell_all_checked(); // сняли чекбокс с нипута меню (чьлю ушло меню)

      // this.httpPost(`${this.emailServ.ip}/mail/setbox`, {
      //     draftId: +id,
      //     boxId: +3,
      //     address: this.emailServ.idPostForHTTP
      //   }).subscribe();


        setTimeout(() => {
        this.draft_list.splice(index, 1); // удаляю из представления
        e.target.closest('.list__prev').classList.remove('dellLetter'); // сняли анимашку
        this.rout.navigate(['./'], { relativeTo: this.activatedRoute }); // скинули роут
}, 500);
}

favorite_tmp(id, flagged, index) {

    this.httpPost(
      `${this.emailServ.ip}/mail/draft_update`,
      {id: id,
        flagged: !flagged,
        address: this.emailServ.idPostForHTTP
      }).subscribe((data) => {});
      this.cancell_all_checked();
      this.draft_list[index].flagged = !flagged;

}

cancell_all_checked() {
  const allInputs = <any>document.querySelectorAll('.settings_checkbox');
  for (const key of allInputs) {
    key.checked = false;
  }
}


    select_cancell_inputs(e) {

      if  (e === true) {
        this._select();
      } else {
        this.canc_select();
      }
    }

    filters_select_letter(e) {

        if (e === 'favor') {
          this.canc_select(); // очищаю предыдущее выделение (если есть) все инпуты, id писем и html привязку чищу
          this.filters_select(
            this.id_selected_letter,
            this.selected_checkbox_for_html,
            '.avatar_checkboxes',
            this.draft_list,
            'flagged');
        }

    }

    // tslint:disable-next-line:max-line-length
    filters_select(id_for_send, select_for_html, inputs_checkbox, base_array, condition) { // БУДЕТ ИСПОЛЬЗОВАТЬСЯ В ОСНОВНОЙ КОЛБАСЕ ПИСЕМ
// ф-я принимает 5 арг: массив id писем, массив булевых для представления, базовый массив с письмами и селектор рабочего инпута
// и состояние поиска по главному массиву
// condition - флаг поиска по массиву писем (либо)


        const allInputs = <any>document.querySelectorAll(inputs_checkbox); // беру все инпуты
        base_array.filter((val, ind) => { // пробегаюсь по главному массиву писем
          if (val[condition] === true) { // если элемент массива совпадает с искомым условием
            select_for_html[ind] = true; // в данных индексах представления ставлю тру для отображения в html
            id_for_send.push(val.draft_id); // пушу id искомых писем в пустой массивец (для отправки на серв к примеру)
            allInputs[ind].checked = true; // ставлю инпуты с нужными индексами в тру (для отображение представления)
          }
        });


  }

}
