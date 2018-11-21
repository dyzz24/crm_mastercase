import { Component, OnInit, Input, DoCheck } from '@angular/core';
import { EmailServiceService } from '../email-service.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-new-message',
  templateUrl: './new-message.component.html',
  styleUrls: ['./new-message.component.scss']
})
export class NewMessageComponent implements OnInit, DoCheck {
  constructor(public emailServ: EmailServiceService, private _rout: Router) { }

private from;
private to;
private copy;
private subject;
private messages;
  ngOnInit() {
  }
  ngDoCheck() {
  }

  closeViewer() {
    this.emailServ.hiddenEmpty = false;
    this._rout.navigate([this.emailServ.urlParams]);
    this.emailServ.fullPath = this.emailServ.urlParams;
    this.emailServ.stateServ();
  }

  sendMessage() {
    this.emailServ.httpPost(
      `${this.emailServ.ip}/mail/send`,
      // tslint:disable-next-line:max-line-length
      { subject: this.subject, text: this.messages, html: this.messages}).subscribe((data) => {
  });

}}
