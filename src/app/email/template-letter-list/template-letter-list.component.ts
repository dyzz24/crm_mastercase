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
  draft_list; // список шаблонов для колбасины

  selected_checkbox_for_html = [];
  collections_inputs_element = [];
  id_selected_letter = [];

  toggle_flag = true;

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
          console.log(data);
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
  this.selected_checkbox_for_html = this.draft_list.map(val => val = true);
  this.id_selected_letter = this.draft_list.map(val => val.draft_id);
  const allInputs = <any>document.querySelectorAll('.avatar_checkboxes');

  for (const key of allInputs) {
      key.checked = true;
  }
} else {
  this.selected_checkbox_for_html = this.draft_list.map(val => val = false);
  this.id_selected_letter = [];
  const allInputs = <any>document.querySelectorAll('.avatar_checkboxes');
  for (const key of allInputs) {
      key.checked = false;
  }
}

  this.toggle_flag = ! this.toggle_flag;

}


}
