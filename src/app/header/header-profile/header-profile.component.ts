import { Component, OnInit, Inject } from '@angular/core';
import { AuthorizationService } from '../../authorization.service';
import { Router, ActivatedRoute} from '@angular/router';


@Component({
  selector: 'app-header-profile',
  templateUrl: './header-profile.component.html',
  styleUrls: ['./header-profile.component.scss']
})
export class HeaderProfileComponent implements OnInit {

  hide_menu_show = false;

  constructor(
    @Inject(AuthorizationService) private authorizationServ: AuthorizationService,
    private rout: Router
  ) { }

  public role = 'Admin';
  public avatarSrc = './assets/user.png';

  ngOnInit() {
  }

  show_menu_toggle() {
    this.hide_menu_show = ! this.hide_menu_show;
  }

  logout() {
    localStorage.clear();
    this.rout.navigate(['/auth']);
  }

}
