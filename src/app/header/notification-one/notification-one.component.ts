import {
  Component,
  DoCheck,
  OnInit
} from '@angular/core';
import { DataService } from '../../data.service';
import { EmailServiceService } from '../../email/email-service.service';


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

  constructor(public dataServ: DataService, public emailServ: EmailServiceService) {
  }

  ngOnInit() {
    this.emailServ.httpPost(`${this.emailServ.ip}/user/login`,
    {email: 'demo@insat.ru', password: '87654321'}, {contentType: 'application/json'}).subscribe((data) => {
      this.emailServ.accessToken = data.accessToken;
      this.emailServ.httpPost(`${this.emailServ.ip}/mail/boxes`, {} ,
      {contentType: 'application/json'}).subscribe((data2) => {
        data2.map((val) => {
          this.all_email_address = [...val.address]; // собираю все адреса ящиков
          this.newMessagesCountArray = [...this.newMessagesCountArray, +val.count]; // собираю их каунты
        });
            this.newMessagesCount = this.newMessagesCountArray.reduce((acc, val) => acc + val); // суммирую каунты
      });
       } );
  }

  ngDoCheck() {
  }

}
