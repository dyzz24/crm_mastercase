import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
  private hidden = false;
  constructor(public dataServ: DataService) { }

  ngOnInit() {
  }
  show($event: any) {
    this.hidden = !this.hidden;
    const thisSrc = $event.target;
    // console.log(document.querySelector('.icon__menu img').src)
    if (this.hidden === true) {
      thisSrc.src = './assets/close.png';
    } else {thisSrc.src = './assets/menu.png'; }
  }
  clearLocalStorage(n) {
    localStorage.clear();
    this.dataServ.menuActive = n;
  }
}
