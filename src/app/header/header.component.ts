import { Component, OnInit} from '@angular/core';
import { DataService } from '../data.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],

})
export class HeaderComponent implements OnInit {
  // public activeComp = 0;
  // private hidden = false;
  constructor(public globalServ: DataService) {
  }

  ngOnInit() {
  }

  // public headCompShow(params: number) {
  //  if (this.activeComp === params) {
  //    this.activeComp = 0;
  //    this.hidden = false;
  //  } else {
  //   this.activeComp = params;
  //   this.hidden = true;
  //  }
  // }
  // private cancelNotife() {
  //   this.activeComp = 0;
  //    this.hidden = false;
  // }
}
