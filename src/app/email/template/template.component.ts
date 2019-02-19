import { Component, OnInit, DoCheck, Inject, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { AuthorizationService } from '../../authorization.service';
import { EmailServiceService } from '../email-service.service';
import {NewMessageService} from '../new-message/new-message.service';
import { Router, ActivatedRoute } from '@angular/router';
import {global_params} from '../../global';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss']
})
export class TemplateComponent implements OnInit, DoCheck {

  show_hidden_templ = false;
  show_all_tmp_state = false;
  search_templates: FormControl = new FormControl('');
  favorit_tmp;
  favorit_tmp_copy;
  all_tmp;
  all_tmp_copy;
  protect_to_copy = false;
  favor_search_state;
  all_search_state;
  @Input() ip;
  @Input() email_address;

  constructor(private http: HttpClient,
    private _rout: Router,
    private activatedRoute: ActivatedRoute,
    @Inject(EmailServiceService) public emailServ: EmailServiceService,
    @Inject(NewMessageService) private newMessageService: NewMessageService,
    @Inject(AuthorizationService) private authorizationServ: AuthorizationService) {
    this.search_templates.valueChanges.pipe().subscribe(data => {
          this.search_tmp(data.toLowerCase());

  });

   }



  ngOnInit() {
//  this.httpPost(
//     `${this.ip}/mail/mails`,
//     // tslint:disable-next-line:max-line-length
//     {address: this.email_address}).subscribe((data) => {
//       // console.log(data);
//   });
}
   public httpPost(url: string, body, options?): Observable<any> {
    return this.http.post(url, body, {headers: {Authorization: `Bearer ${this.authorizationServ.accessToken}`}});
  }

   search_tmp(data) {
     let favor_search_state; // временные булевы
     let all_search_state;
      if (data !== '' && this.protect_to_copy === false) { // если инпут не пуст и вызов первый
          this.favorit_tmp_copy = this.favorit_tmp; // копируем во временный массив всё
          this.all_tmp_copy = this.all_tmp;
          this.protect_to_copy = true; // переключаем флаг чтобы больше не трогали
      }
      if (data === '') { // если инпут пуст
        this.favorit_tmp = this.favorit_tmp_copy; // возвращаем исходные массивы
        this.all_tmp =  this.all_tmp_copy;
        this.all_search_state = false; // снимаем флаг с "Не найдено по всем шаблонам"
        this.favor_search_state = false; // снимаем флаг с "Не найдено по избранным шаблонам"
        return;
      }
      const new_all_tmp = this.all_tmp.filter(val => { // массив найденных совпадений (1)
        if (val.title === null) {
          return;
        }
        if (val.title.toLowerCase().indexOf(data) >= 0 ) {
          all_search_state = true;
          return val;
      }

   });

   const new_all_favorit = this.favorit_tmp.filter(val => { // массив найденных совпадений (2)
    if (val.title === null) {
      return;
    }
    if (val.title.toLowerCase().indexOf(data) >= 0 ) {
      favor_search_state = true;
      return val;
  }
});

    if (all_search_state) { // если совпадения есть
      this.all_tmp = new_all_tmp; // ставим в массив для HTML
      this.all_search_state = false; // убираем флаг с Не найдено
    } else {
      this.all_search_state = true; // иначе ставим флаг Не найдено
    }
    if (favor_search_state) {
      this.favorit_tmp = new_all_favorit; // аналогично для избранных
      this.favor_search_state = false;
    } else {
      this.favor_search_state = true;
    }

  }
  ngDoCheck() {
  }

  show_hide_templContainer(e) { // открываю список шаблонов + запрашиваю их на серве
      this.show_hidden_templ = ! this.show_hidden_templ;
      if (this.show_hidden_templ) {
        this.httpPost(
          `${global_params.ip}/mail/draft/`,
          // tslint:disable-next-line:max-line-length
          {
          }).subscribe((data) => {

            this.all_tmp = data.filter(val => {
              if (!val.flagged) {
                  return val;
              }
            });
            this.favorit_tmp = data.filter(val => {
              if (val.flagged) {
                  return val;
              }
            });

          });
      }
  }
  show_all_tmp() {
    this.show_all_tmp_state = ! this.show_all_tmp_state;
  }
  select_tmp(e, id) {
    if (e.target.className === 'la la-star-o' || e.target.className === 'la la-star') {
      return;
    }
      this.show_hidden_templ = false;
      // this.httpPost(
      //   `${this.ip}/mail/mails`,
      //   // tslint:disable-next-line:max-line-length
      //   {address: this.email_address}).subscribe((data) => {
      //     // console.log(data);
      // });
  }

  favorite_do(select_templ, e) {
    // console.log(e.target.className);
    if (e.target.className === 'la la-star-o') {
      this.all_tmp = this.all_tmp.filter(val => {
        if (val !== select_templ) {
            return val;
        }
      });
      this.favorit_tmp.push(select_templ);
    }
    if (e.target.className === 'la la-star') {
      this.favorit_tmp = this.favorit_tmp.filter(val => {
        if (val !== select_templ) {
            return val;
        }
      });
      this.all_tmp.push(select_templ);
    }
    this.httpPost(
      `${global_params.ip}/mail/draft/update`,
      {draftId: select_templ.draft_id,
        flagged: !select_templ.flagged,
        address: this.emailServ.idPostForHTTP
      }).subscribe((data) => {});


  }


}
