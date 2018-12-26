import { Component, OnInit, DoCheck, Inject, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { AuthorizationService } from '../../authorization.service';

@Component({
  selector: 'app-template',
  templateUrl: './template.component.html',
  styleUrls: ['./template.component.scss']
})
export class TemplateComponent implements OnInit, DoCheck {

  show_hidden_templ = false;
  show_all_tmp_state = false;
  search_templates: FormControl = new FormControl('');
  favorit_tmp = [{name: 'Раз шаблон'}, {name: 'Два шаблон'}, {name: 'Три шаблон'}, {name: 'four'}];
  favorit_tmp_copy;
  all_tmp = [{name: '11111111'}, {name: 'pppppppp'}, {name: 'sssssssss'}, {name: 'Раз шаблон'}];
  all_tmp_copy;
  protect_to_copy = false;
  favor_search_state;
  all_search_state;
  @Input() ip;
  @Input() email_address;

  constructor(private http: HttpClient,
    @Inject(AuthorizationService) private authorizationServ: AuthorizationService) {
    this.search_templates.valueChanges.pipe().subscribe(data => {
          this.search_tmp(data.toLowerCase());
  });

   }



  ngOnInit() {
 this.httpPost(
    `${this.ip}/mail/mails`,
    // tslint:disable-next-line:max-line-length
    {address: this.email_address, boxId: 4, limit: 100, offset: 0}).subscribe((data) => {
      console.log(data);
  });
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
        if (val.name.toLowerCase().indexOf(data) >= 0 ) {
          all_search_state = true;
          return val;
      }

   });

   const new_all_favorit = this.favorit_tmp.filter(val => { // массив найденных совпадений (2)
    if (val.name.toLowerCase().indexOf(data) >= 0 ) {
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

  show_hide_templContainer(e) {
      this.show_hidden_templ = ! this.show_hidden_templ;
  }
  show_all_tmp() {
    this.show_all_tmp_state = ! this.show_all_tmp_state;
  }
  select_tmp(e, index) {
    if (e.target.className === 'la la-star-o') {
      return;
    }
    console.log(index);
  }

}
