import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';

@Component({
  selector: 'app-header-left',
  templateUrl: './header-left.component.html',
  styleUrls: ['./header-left.component.scss']
})
export class HeaderLeftComponent implements OnInit {
private items;
  constructor(public globalServ: DataService) {
   }
  ngOnInit() {
    this.items = this.globalServ.newMessages;
    console.log(this.items);
  }

}
