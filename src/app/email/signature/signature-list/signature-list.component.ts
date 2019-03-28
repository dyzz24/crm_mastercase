import { Component, OnInit, Input, Inject } from '@angular/core';
import { EmailServiceService } from '../../email-service.service';
import { Observable, Subscription } from 'rxjs';
import { Router, ActivatedRoute} from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {global_params} from '../../../global';


@Component({
  selector: 'app-signature-list',
  templateUrl: './signature-list.component.html',
  styleUrls: ['./signature-list.component.scss']
})
export class SignatureListComponent implements OnInit {

  succes_search_flag = false;
  not_succes_search_flag = false;
  selected_checkbox_for_html = [];
  subscription: Subscription;
  id_selected_letter: Array<number> = [];
  @Input() email_id: string;
  @Input() token: string;
  constructor(@Inject(EmailServiceService) public emailServ: EmailServiceService,
  private http: HttpClient,
  private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.subscription = this.activatedRoute.params.subscribe(params => {
      console.log(params);
      // this.emailServ.signature_list = [{title: 'phph'}, {title: 'jsjsjs'}];
    });
  }

  public httpPost(url: string, body, options?): Observable<any> {
    return this.http.post(url, body, {headers: {Authorization: `Bearer ${this.token}`}});
  }


  scroll_up() {
    const toTopBlock = document.querySelector('.wrapper');
    toTopBlock.scroll(0, 0);
  }

  cancell_all_checked() {
    const allInputs = <any>document.querySelectorAll('.settings_checkbox');
    for (const key of allInputs) {
      key.checked = false;
    }
  }

  delete_sign(sign_id) {
    this.emailServ.signature_list = this.emailServ.signature_list.filter(val => val.id !== + sign_id);
    this.httpPost(`${global_params.ip}/mail/signature/delete`, {
      signatureId: +sign_id}).subscribe((data) => {});
  }

}
