import { Component, OnInit, Input } from '@angular/core';
import {BubbleServiceService} from '../bubble-service.service';
import { Observable, Subscription } from 'rxjs';



@Component({
  selector: 'app-bubble',
  templateUrl: './bubble.component.html',
  styleUrls: ['./bubble.component.scss']
})
export class BubbleComponent implements OnInit {
  public show_bables_state: boolean; // состояние текущего бабла
  private subscriber_on_cancell: Subscription; // состояние остальных
  private flagged = false; // toggler


  @Input() name: String = '' || null; // имя пользователя для отображения в бабле
  @Input() email: String = '' || null; // его ящик





  constructor(private bublService: BubbleServiceService) { }

  ngOnInit() {
    this.subscriber_on_cancell = this.bublService.cancell_all_bables.subscribe(val => {
        this.show_bables_state = val; // подписка для скрытия остальных баблов (активный только один бабл)
        this.flagged = val;
    });
  }

  show_bables(e, canc_attr?) {

if (e.target.className === 'bables__btn') { // если нажали по кнопке меню бабла - выйти и закрыть бабл
  this.bublService.cancell_all_bables.next(false);
  return;
}

if (canc_attr) { // если нажали по поп-апу на заднем плане - выйти и закрыть меню бабла
  this.bublService.cancell_all_bables.next(false);
  return;
}


if (!this.flagged) { // если первый раз кликнули на бабл

this.bublService.cancell_all_bables.next(false); // скрыть остальные
this.show_bables_state = true; // показать меню текущего бабла
this.flagged = true; // перевести флаг

} else { // если кликнули второй раз на бабл

  this.bublService.cancell_all_bables.next(false); // скрыть текущий бабл и все остальные, флаг в первоначальное
  this.flagged = true;
}






  }

}
