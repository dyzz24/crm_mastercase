import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-signature-list',
  templateUrl: './signature-list.component.html',
  styleUrls: ['./signature-list.component.scss']
})
export class SignatureListComponent implements OnInit {


  @Input() email_id: string;
  constructor() { }

  ngOnInit() {
    console.log(this.email_id);
  }

}
