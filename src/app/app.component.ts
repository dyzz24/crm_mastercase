import { Component } from '@angular/core';
import { DataService } from './data.service';
import { AuthorizationService } from './authorization.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular';
  constructor (globalService: DataService, authorizationService: AuthorizationService) {
  }
}
