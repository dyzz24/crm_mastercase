import { Component } from '@angular/core';
import { AuthorizationService } from './authorization.service';
import {global_params} from './global';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'angular';

  public new_ip;
  constructor (authorizationService: AuthorizationService) {
  }

  edit_ip_complite() {
    if (!this.new_ip) {
      return;
    }
    global_params.ip = `http://${this.new_ip}`;
    global_params.socket_ip = `ws://${this.new_ip}`;
    console.log(global_params);
  }
}
