import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-header-profile',
  templateUrl: './header-profile.component.html',
  styleUrls: ['./header-profile.component.scss']
})
export class HeaderProfileComponent implements OnInit {

  constructor() { }

  public name = 'Сергей';
  public surname = 'Иванов';
  public role = 'Admin';
  public avatarSrc = './assets/user.png';

  ngOnInit() {
  }

}
