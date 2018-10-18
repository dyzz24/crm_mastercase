import { Component} from '@angular/core';
import { DataService } from '../../data.service';

@Component({
  selector: 'app-notification-two',
  templateUrl: './notification-two.component.html',
  styleUrls: ['./notification-two.component.scss']
})
export class NotificationTwoComponent {

  constructor(public dataServ: DataService) { }

  cancelNotif() {
    this.dataServ.onClearNotifTwo();
  }

}
