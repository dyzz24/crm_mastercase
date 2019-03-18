import { Component, OnInit, Input } from '@angular/core';



@Component({
  selector: 'app-bubble',
  templateUrl: './bubble.component.html',
  styleUrls: ['./bubble.component.scss']
})
export class BubbleComponent implements OnInit {
  public show_bables_state: boolean;


  @Input() name: String = '' || null;
  @Input() email: String;





  constructor() { }

  ngOnInit() {

  }

  show_bables() {


     this.show_bables_state = !this.show_bables_state;

    console.log(this.show_bables_state);
  }

}
