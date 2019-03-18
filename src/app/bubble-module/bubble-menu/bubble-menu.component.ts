import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-bubble-menu',
  templateUrl: './bubble-menu.component.html',
  styleUrls: ['./bubble-menu.component.scss']
})
export class BubbleMenuComponent implements OnInit {

  @Input() change_menu_state: Boolean = false;
  @Input() name_params;

  constructor() { }

  ngOnInit() {
  }

  copy_address() {
    const textArea = document.createElement('textarea');
    textArea.setAttribute('value', this.name_params);
    document.body.appendChild(textArea);
    textArea.textContent = this.name_params;
    textArea.focus();
    textArea.select();
    document.execCommand('copy');  // Security exception may be thrown by some browsers.
    document.body.removeChild(textArea);

  }

}
