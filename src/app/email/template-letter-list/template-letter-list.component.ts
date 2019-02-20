import { Component, OnInit, Inject, OnDestroy} from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthorizationService } from '../../authorization.service';
import { Observable, Subscription } from 'rxjs';
import {global_params} from '../../global';
import { EmailServiceService } from '../email-service.service';
import { ToastrService} from 'ngx-toastr';


@Component({
  selector: 'app-template-letter-list',
  templateUrl: './template-letter-list.component.html',
  styleUrls: ['./template-letter-list.component.scss']
})
export class TemplateLetterListComponent implements OnInit, OnDestroy {

  subscription: Subscription;
  subscription_emailServ_template_list: Subscription;
  email_id; // имя ящика для запроса
  draft_list; // список шаблонов для колбасины -- ГЛАВНЫЙ ДЛЯ РАБОТЫ

  selected_checkbox_for_html = [];
  collections_inputs_element = [];
  id_selected_letter = [];

  toggle_flag = true;
  open_hidden_menu = false;

  protectToCopy = false;
  succes_search_flag = false;
  not_succes_search_flag = false;
  draft_copy_search = [];

  // для выделения шифтом
  selected_one_input_elem;
  min_max_arr = [];


  constructor(
    @Inject(AuthorizationService) private authorizationServ: AuthorizationService,
    @Inject(EmailServiceService) public emailServ: EmailServiceService,
    @Inject(ToastrService) private toastrServ: ToastrService,
    private rout: Router,
    private http: HttpClient,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {



    this.subscription = this.activatedRoute.params.subscribe(params => { // при каждом изменении роута
      this.emailServ.haveResponse = false; // включаю крутилку загрузки как пришел ответ
      this.email_id = params.email_id; // имя ящика (seo@)
      this.emailServ.idPostForHTTP = this.email_id; // присваиваю в глобальную
      this.httpPost(
        `${global_params.ip}/mail/draft/`,
        // tslint:disable-next-line:max-line-length
        {address: this.email_id}).subscribe((data) => {
          this.emailServ.haveResponse = true; // отключаю крутилку
          this.emailServ.draft_list = data; // список всех шаблонов
          console.log(this.emailServ.draft_list);

          this.selected_checkbox_for_html = this.emailServ.draft_list.map(val => {
            return val = false; // заполняю фалсами массив для чекбоксов

          });
        });
    });

    this.subscription_emailServ_template_list = this.emailServ.draft_list_edited.subscribe(params => {
      if (params === 'delete') { // подписываюсь на событие из 3 компонента (удалить шаблон)
        this.canc_select(); // отмеяю чекбоксы
      }

    });

  }

  ngOnDestroy() {
    this.subscription_emailServ_template_list.unsubscribe();
    this.subscription.unsubscribe();
  }



  public httpPost(url: string, body, options?): Observable<any> {
    return this.http.post(url, body, {headers: {Authorization: `Bearer ${this.authorizationServ.accessToken}`}});
  }

  select_letter(e, index, id) { // выбор чекбокса так же как в letterlist
    if (e.shiftKey) {
      return; // еслт по шифту - выходим
    }
    if (e.target.checked) {
      this.selected_checkbox_for_html[index] = true;
      this.id_selected_letter = [...this.id_selected_letter, +id]; // засовываю id письма по клику
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

  cancell_checked(e, index) { // отменяю чекбокс выделение
    const allInputs = <any>document.querySelectorAll('.settings_checkbox');
          for (let i = 0; i <= allInputs.length - 1; i++) {
            if (index === i) {
              continue;
            }
            allInputs[i].checked = false;
          }

          if (e.target.checked === true) {
            this.open_hidden_menu = true; // блок заглушка для "кликните в любом месте и исчезнет меню"
          } else {
            this.open_hidden_menu = false;
          }
}

close_menu() { // закрывает меню колбасы конвертика при клике на блок заглушку

  this.open_hidden_menu = false;

  const allInputs = <any>document.querySelectorAll('.settings_checkbox');
  for (let i = 0; i <= allInputs.length - 1; i++) {
    allInputs[i].checked = false;
  }
}



canc_select() { // отменяет выделение всех писем
  this.selected_checkbox_for_html = this.emailServ.draft_list.map(val => val = false);
  this.id_selected_letter = [];
  const allInputs = <any>document.querySelectorAll('.avatar_checkboxes');
  for (const key of allInputs) {
      key.checked = false;
  }
}

_select() { // выделяет все письма
  this.selected_checkbox_for_html = this.emailServ.draft_list.map(val => val = true);
  this.id_selected_letter = this.emailServ.draft_list.map(val => val.draft_id);
  const allInputs = <any>document.querySelectorAll('.avatar_checkboxes');

  for (const key of allInputs) {
      key.checked = true;
  }
}


search_in_templates(data) {
  this.canc_select();
  if (this.protectToCopy === false) {
    this.draft_copy_search = this.emailServ.draft_list; // сохраняю исходные письма и сношу флаг
    this.protectToCopy = true;
  }

  if (data === '') { // если инпут пустой
    this.emailServ.draft_list = this.draft_copy_search; // вставляю исходный список писем
    this.protectToCopy = false; // разрешаю снова сохранять исходные письма
    this.draft_copy_search = []; // очищаю временный массив писем
    this.succes_search_flag = false;
    this.not_succes_search_flag = false;
    // this.filterError = false; // переключатель для "Письма не найдены" в html
    return;
  }

  const new_search_array = this.draft_copy_search.filter((val, ind) => {
    if (val.title && val.title.toLowerCase().indexOf(data) >= 0 ) { // сам поиск ищу по имени шаблона
      return val;
    }});

    if (new_search_array.length > 0) { // если совпадения есть
      this.emailServ.draft_list = new_search_array;
      this.succes_search_flag = true; // отправляю флаг что нашли письма
      this.not_succes_search_flag = false; // удаляю флаг что письма не нашли (если остался)
    }


    if (new_search_array.length === 0) { // если совпадений нет
      this.emailServ.draft_list = new_search_array;
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
    this.canc_select();

        setTimeout(() => {
        this.emailServ.draft_list.splice(index, 1); // удаляю из представления
        e.target.closest('.list__prev').classList.remove('dellLetter'); // сняли анимашку
        this.rout.navigate(['./'], { relativeTo: this.activatedRoute }); // скинули роут
}, 500);
}

favorite_tmp(id, flagged, index) { // сделать шаблон избранным

    this.httpPost(
      `${global_params.ip}/mail/draft/update`,
      {id: id,
        flagged: !flagged,
        address: this.emailServ.idPostForHTTP
      }).subscribe((data) => {});
      this.cancell_all_checked(); // скидываем активный чекбокс меню
      this.emailServ.draft_list[index].flagged = !flagged; // меняю на противоположное

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
            this.emailServ.draft_list,
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

  important_all_letter() {
    if (this.id_selected_letter.length === 0) { // если выбранных писем нет - выйти
      this.showError('Выберите хотя бы один шаблон'); // выведет сообщение что ты не прав
      return;
    }
    const all_data_for_http = []; // массив с id писем для бэка
    for (const key of this.id_selected_letter) {
      all_data_for_http.push( // пушу в него объекты для бэка
        {id: key,
        flagged: true,
        address: this.emailServ.idPostForHTTP}
      );
    }

    this.httpPost(
      `${global_params.ip}/mail/draft/update`,
      all_data_for_http).subscribe((data) => {}); // всё это отправляю

    this.emailServ.draft_list.filter(val => { // прохожусь по массиву всех конвертиков
          for (const key of this.id_selected_letter) { // прохожусь по массиву выбранных id писем
              if  (key === val.draft_id)  { // если нашлись
                  val.flagged = true; // меняю флаг
                  return val;
              }
          }
    });
    this.canc_select(); // скидываю все чекбоксы
  }

  delete_all_letter() {
    if (this.id_selected_letter.length === 0) {
      this.showError('Выберите хотя бы один шаблон');
      return;
    }
    const all_data_for_http = [];
    for (const key of this.id_selected_letter) {
      all_data_for_http.push(
        {draftId: key,
        boxId: +3,
        address: this.emailServ.idPostForHTTP}
      );
    }

    this.httpPost(
      `${global_params.ip}/mail/draft/update`,
      all_data_for_http).subscribe((data) => {});


    this.emailServ.draft_list.filter((val, ind, arr) => { // прохожусь по массиву всех конвертиков
          for (const key of this.id_selected_letter) { // прохожусь по массиву выбранных id писем
              if  (val.draft_id === key)  { // если нашлись
                arr[ind] = 'null';
                return arr;
              }
          }
    });

    this.emailServ.draft_list = this.emailServ.draft_list.filter(
      a => a !== 'null' // возвращаю массив без null (удаленных элементов)
    );


    this.canc_select(); // скидываю все чекбоксы
  }

  showError(param) {
    this.toastrServ.error(param);
  }

  scroll_up() {
    const toTopBlock = document.querySelector('.wrapper');
    toTopBlock.scroll(0, 0);
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
            this.selected_checkbox_for_html.fill(true, this.min_max_arr[0], this.min_max_arr[1] + 1); // заполняю тру для  представления
    for (let i = this.min_max_arr[0]; i <= this.min_max_arr[1]; i++) {
            this.id_selected_letter.push(this.emailServ.draft_list[i].draft_id); // пушу айдишники
          }
          this.id_selected_letter = this.id_selected_letter.filter( // фильтрую дубли
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

          this.selected_checkbox_for_html.fill(false, this.min_max_arr[0], this.min_max_arr[1] + 1);

            for (let i = this.min_max_arr[0]; i <= this.min_max_arr[1]; i++) {
              allInputs[i].checked = false;
            }
            this.id_selected_letter.splice(index); // начиная с индекса по которому кликнули, удаляю все id-шки из выбранных
        }
      }
            return;
    }

  this.selected_one_input_elem = index; // если просто клик, ловлю индекс


    }

  }


