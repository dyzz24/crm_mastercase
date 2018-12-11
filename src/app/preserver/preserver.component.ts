import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-preserver',
  templateUrl: './preserver.component.html',
  styleUrls: ['./preserver.component.scss']
})
export class PreserverComponent implements OnInit {

  hidden_preserver = false;
  urls_array = [{url_states: ''}];

  constructor(private rout: Router) { }

  ngOnInit() {
  }

  toggle_state_pres() {
    this.hidden_preserver = ! this.hidden_preserver;
    this.urls_array = JSON.parse(localStorage.getItem('bookmark-states')) ;
  }

  save_bookmark() {

      const state_rout = this.rout.url;
      if (localStorage.getItem('bookmark-states') === null) {
      const array_b_states = [
        {url_states: state_rout}
      ];
      localStorage.setItem('bookmark-states', JSON.stringify(array_b_states));
  } else {
    const temp_arr = JSON.parse(localStorage.getItem('bookmark-states'));
    for (let i = 0; i < temp_arr.length; i++) {

          if (temp_arr[i].url_states === state_rout) {
            return;
          }
    }
    temp_arr.push({url_states: state_rout});
    this.urls_array = temp_arr;
    localStorage.setItem('bookmark-states', JSON.stringify(this.urls_array));
  }
  // const add_btn = document.querySelector('.preserver_starter');
  // add_btn.classList.add('add_b_anim')
}

state_url_go(i) {
  this.rout.navigate(['/']); // костыль, но работает
  setTimeout(() => {
    this.rout.navigate([this.urls_array[i].url_states]);
  }, 10);
}

}
