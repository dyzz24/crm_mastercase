import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-email',
  templateUrl: './add-email.component.html',
  styleUrls: ['./add-email.component.scss']
})
export class AddEmailComponent implements OnInit {

  tab_open = 1;

  constructor() { }

  ngOnInit() {
  }

  test(e) {
    if (e.target.value === 'one_tab') {
      this.tab_open = 1;
    }
    if (e.target.value === 'two_tab') {
      this.tab_open = 2;
    }
  }

}
