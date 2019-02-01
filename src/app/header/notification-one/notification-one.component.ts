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
    this.httpPost(`${this.authorizationServ.ip}/mail/box/`, {} ,
      {contentType: 'application/json'}).subscribe((data2) => {

        this.newMessagesCount  = data2.stats.reduce((summ, item) => {
            summ +=  item && +item.count || 0;
            return summ;
        }, 0);
        // if (data2.length === 0) {
        //   return;
        // }
        // data2.map((val) => {
        //   this.newMessagesCountArray = [...this.newMessagesCountArray, +val.count]; // собираю их каунты
        // });
        //     this.newMessagesCount = this.newMessagesCountArray.reduce((acc, val) => acc + val); // суммирую каунты
      });
  }

  ngDoCheck() {
  }

}
