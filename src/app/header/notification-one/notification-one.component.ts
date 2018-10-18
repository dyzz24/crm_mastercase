import {
  Component,
  DoCheck,
  OnInit
} from '@angular/core';
import { DataService } from '../../data.service';
import { EmailServiceService } from '../../email/email-service.service';
import { lettersInbox } from '../../email/email-list/emails';

@Component({
  selector: 'app-notification-one',
  templateUrl: './notification-one.component.html',
  styleUrls: ['./notification-one.component.scss']
})
export class NotificationOneComponent implements OnInit, DoCheck {

  public newMessages = [];
  private inboxes = lettersInbox;
  private newMessagesCount: number;

  constructor(public dataServ: DataService, public emailServ: EmailServiceService) {
  }

  ngOnInit() {
    this.countMessageCheck();
    this.newMessagesCount = this.newMessages.length;
  }

  ngDoCheck() {
    this.countMessageCheck();
    this.newMessagesCount = this.newMessages.length;
  }


  countMessageCheck() {
    const mapArr = this.inboxes.map((currentValue, index) => {
      // tslint:disable-next-line:forin
      for (const key in currentValue) {
        for (const key2 of currentValue[key]) {
          if (key2.status === 'new') {
            this.newMessages = [...this.newMessages, key2];
          // tslint:disable-next-line:max-line-length
          } else { this.newMessages = this.newMessages.filter(item =>  item !== key2); } // если потерял статус new - удалить элемент из массива
        }
      }
      this.newMessages = this.newMessages.filter((val, ind, self) => {
        return self.indexOf(val) === ind; } );

    });
    this.dataServ.newMessages = this.newMessages;
  }


  cancelNotif() {
    this.dataServ.onClearNotifOne();
  }
}
