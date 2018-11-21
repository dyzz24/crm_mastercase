import { Component } from '@angular/core';
import { DataService } from './data.service';
import { EmailServiceService } from './email/email-service.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular';
  constructor (globalService: DataService, public emailServ: EmailServiceService) {
  }
}
