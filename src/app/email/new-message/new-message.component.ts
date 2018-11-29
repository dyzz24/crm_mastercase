import { Component, OnInit, Input, DoCheck, Inject } from '@angular/core';
import { EmailServiceService } from '../email-service.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthorizationService } from '../../authorization.service';


@Component({
  selector: 'app-new-message',
  templateUrl: './new-message.component.html',
  styleUrls: ['./new-message.component.scss']
})
export class NewMessageComponent implements OnInit, DoCheck {
  constructor(
    @Inject(EmailServiceService) public emailServ: EmailServiceService,
    private _rout: Router,
    private http: HttpClient,
    @Inject(AuthorizationService) private authorizationServ: AuthorizationService) { }

private from;
private to = [this.emailServ.to_answer];
private to_text;
private copy = this.emailServ.to_all_answer;
private hidden_copy = [];
private subject = this.emailServ.to_subject;
private messages;

  ngOnInit() {
    // console.log(this.emailServ.to_all_answer.length)
  }
  ngDoCheck() {
    console.log(this.to_text);
  }

  public httpPost(url: string, body, options?): Observable<any> {
    return this.http.post(url, body, {headers: {Authorization: `Bearer ${this.authorizationServ.accessToken}`}});
  }

  


  closeViewer() {
    this.emailServ.hiddenEmpty = false;
    this._rout.navigate([this.emailServ.urlParams]);
    this.emailServ.fullPath = this.emailServ.urlParams;
    // this.emailServ.stateServ();
  }

  sendMessage() {
  //   this.httpPost(
  //     `${this.emailServ.ip}/mail/send`,
  //     // tslint:disable-next-line:max-line-length
  //     { subject: this.subject, text: this.messages, html: this.messages, to: this.to}).subscribe((data) => {
  // });

}}
