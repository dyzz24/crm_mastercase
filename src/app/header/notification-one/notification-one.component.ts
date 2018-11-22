import {
  Component,
  DoCheck,
  OnInit
} from '@angular/core';
import { DataService } from '../../data.service';
import { EmailServiceService } from '../../email/email-service.service';
import { HttpClient } from '@angular/common/http';
import { Router} from '@angular/router';
import { Observable } from 'rxjs';
import { AuthorizationService } from '../../authorization.service';
// import { setInterval } from 'timers';


@Component({
  selector: 'app-notification-one',
  templateUrl: './notification-one.component.html',
  styleUrls: ['./notification-one.component.scss']
})
export class NotificationOneComponent implements OnInit, DoCheck {

  public newMessages = [];

  private newMessagesCountArray = [];
  private newMessagesCount;
  private all_email_address;
  private accessToken;
  private response_flagged = false;

  constructor(public dataServ: DataService,
     public http: HttpClient,
    private authorizationServ: AuthorizationService, private emailServ: EmailServiceService) {
  }
  private httpPost(url: string, body, options?): Observable<any> {
    return this.http.post(url, body, {headers: {Authorization: `Bearer ${this.accessToken}`}});
  }

  ngOnInit() {
    const requestInterval = setInterval(() => {
      this.accessToken = this.authorizationServ.accessToken;
      if (this.accessToken !== undefined) {
        this.getInfo();
        clearInterval(requestInterval); // если токен не пришел, продолжает опрашивать сервис авторизации
      }
    }, 1000);

  }
  getInfo() {
    this.httpPost(`${this.authorizationServ.ip}/mail/boxes`, {} ,
      {contentType: 'application/json'}).subscribe((data2) => {
        data2.map((val) => {
          this.all_email_address = [...val.address]; // собираю все адреса ящиков
          this.newMessagesCountArray = [...this.newMessagesCountArray, +val.count]; // собираю их каунты
        });
            this.newMessagesCount = this.newMessagesCountArray.reduce((acc, val) => acc + val); // суммирую каунты
      });
  }

  ngDoCheck() {
  }

}
