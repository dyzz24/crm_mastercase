import { Component, OnInit, Output, EventEmitter, Input, DoCheck, Inject} from '@angular/core';
import { FormControl, ReactiveFormsModule} from '@angular/forms';
import {global_params} from '../../global';
import { Observable} from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { EmailServiceService } from '../email-service.service';
import { AuthorizationService } from '../../authorization.service';

@Component({
  selector: 'app-email-header',
  templateUrl: './email-header.component.html',
  styleUrls: ['./email-header.component.scss']
})
export class EmailHeaderComponent implements OnInit, DoCheck {

  public toggle_checked_inputs_flag = true;
  searchLettersInput: FormControl = new FormControl('');
  private search_work = false;
  hide_left_btn_status = false;
  hidden_top_menu = false;


  @Output() select_cancell_all_inputs = new EventEmitter(); // отправка события родителю
  @Output() filters_selected = new EventEmitter(); // отправка события родителю
  @Output() search_function = new EventEmitter(); // отправка события родителю для скрытия компонента папок
  @Output() scroll_up_event = new EventEmitter(); // отправка события родителю для скрытия компонента папок
  @Input() success_search;
  @Input() not_success_search;

  constructor(
    private http: HttpClient,
    @Inject(AuthorizationService) private authorizationServ: AuthorizationService,
    @Inject(EmailServiceService) public emailServ: EmailServiceService,
    ) {

    this.searchLettersInput.valueChanges.pipe().subscribe(data => {
            this.search_function.next(data);
            if (data !== '') {
              this.search_work = true;
            }
            if (data === '') {
              this.search_work = false;
            }
  });

  }

  ngOnInit() {

  }

  ngDoCheck() {
    // console.log(this.success_search);
  }

  select_all_inputs_do() {
    // this.select_all_inputs.next(); // отправляю событие на скрытие компонента
    if (this.toggle_checked_inputs_flag) {
      this.select_cancell_all_inputs.next(true);
    } else {
      this.select_cancell_all_inputs.next(false);
    }
    this.toggle_checked_inputs_flag = ! this.toggle_checked_inputs_flag;
  }

  select_canc_all_inputs_do(boolean) { // для выделение в меню стрелочки
      if (boolean) {
        this.select_cancell_all_inputs.next(true);
        this.toggle_checked_inputs_flag = false;
      } else {
        this.select_cancell_all_inputs.next(false);
        this.toggle_checked_inputs_flag = true;
      }
      this.hidden_top_menu = false; // скрываю меню
  }

  hide_left_btn(bool) {
      if (bool) {
        this.hide_left_btn_status = true;
      } else {
        this.hide_left_btn_status = false;
      }
  }

  toggle_header_menu() {
      this.hidden_top_menu = ! this.hidden_top_menu;
  }

  filters_input(data) { // ф-я отправляет data с определенными флагами для родителя
    this.hidden_top_menu = false; // скрываю меню
    this.toggle_checked_inputs_flag = true; // скидываю кнопку массового выделения (если вдруг стояла)
      this.filters_selected.next(data); // отправляю событие родителю
  }

  scroll_up() {
      this.scroll_up_event.next();
  }


  public httpPost(url: string, body, options?): Observable<any> {
    return this.http.post(url, body, {headers: {Authorization: `Bearer ${this.authorizationServ.accessToken}`}});
  }

  get_message() {
    this.httpPost(
      `${global_params.ip}/mail/box/sync`,
      // tslint:disable-next-line:max-line-length
      {address: this.emailServ.idPostForHTTP}).subscribe((data) => {});
  }

}
