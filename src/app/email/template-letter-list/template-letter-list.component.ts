import { Component, OnInit, Inject } from '@angular/core';
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
          // console.log(data);
        });
    });
  }

  public httpPost(url: string, body, options?): Observable<any> {
    return this.http.post(url, body, {headers: {Authorization: `Bearer ${this.authorizationServ.accessToken}`}});
  }

}