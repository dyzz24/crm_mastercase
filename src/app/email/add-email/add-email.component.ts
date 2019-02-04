import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-email',
  templateUrl: './add-email.component.html',
  styleUrls: ['./add-email.component.scss']
})
export class AddEmailComponent implements OnInit {

  tab_open = 1;
  hide_inputs = false;

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

  toggle_password_show() {
    const password_inp = document.querySelector('.password');
    const current_attribute = password_inp.getAttribute('type');
    if (current_attribute === 'password') {
      password_inp.setAttribute('type', 'text');
    } else {
      password_inp.setAttribute('type', 'password');
    }
  }

  toggle_edit_login(e) {
    const bool = e.target.checked;

    if (!bool) {
      this.hide_inputs = true;
    } else {
      this.hide_inputs = false;
    }
  }
}

