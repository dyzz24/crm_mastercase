import { Component, OnInit, Inject } from '@angular/core';
import { AuthorizationService } from '../../authorization.service';


@Component({
  selector: 'app-header-profile',
  templateUrl: './header-profile.component.html',
  styleUrls: ['./header-profile.component.scss']
})
export class HeaderProfileComponent implements OnInit {

  constructor(
    @Inject(AuthorizationService) private authorizationServ: AuthorizationService,
  ) { }

  public name;
  public role = 'Admin';
  public avatarSrc = './assets/user.png';

  ngOnInit() {
    const requestInterval = setInterval(() => {
      if (this.authorizationServ.accessToken !== undefined) {
        clearInterval(requestInterval); // если токен не пришел, продолжает опрашивать сервис авторизации
        this.name =  this.authorizationServ.name;
      }
    }, 1000);
  }

}
