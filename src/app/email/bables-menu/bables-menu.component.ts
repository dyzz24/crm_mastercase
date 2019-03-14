import { Component, OnInit, Input, DoCheck} from '@angular/core';

@Component({
  selector: 'app-bables-menu',
  templateUrl: './bables-menu.component.html',
  styleUrls: ['./bables-menu.component.scss']
})
export class BablesMenuComponent implements OnInit, DoCheck {

  public show_bables = false;



  @Input() change_bables_state = false;
  @Input() email_params;
  constructor() { }

  ngOnInit() {

  }

  ngDoCheck() {
    // console.log(this.email_params);
  }

  copy_address() {
  const textArea = document.createElement('textarea');
  textArea.setAttribute('value', this.email_params);
  document.body.appendChild(textArea);
  textArea.textContent = this.email_params;
  textArea.focus();
  textArea.select();
  document.execCommand('copy');  // Security exception may be thrown by some browsers.
  document.body.removeChild(textArea);

}
  // document.body.removeChild(textArea);

}
