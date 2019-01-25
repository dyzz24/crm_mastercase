import { Component, OnInit, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-email-header',
  templateUrl: './email-header.component.html',
  styleUrls: ['./email-header.component.scss']
})
export class EmailHeaderComponent implements OnInit {


  @Output() select_all_inputs = new EventEmitter(); // отправка события родителю для скрытия компонента папок

  constructor() { }

  ngOnInit() {

  }

  select_all_inputs_do() {
    this.select_all_inputs.next(); // отправляю событие на скрытие компонента
  }

}
