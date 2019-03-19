import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-signature-create',
  templateUrl: './signature-create.component.html',
  styleUrls: ['./signature-create.component.scss']
})
export class SignatureCreateComponent implements OnInit {

  private email_id: string;
  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    console.log(this.activatedRoute.parent.params)
    // this.subscription = this.activatedRoute.parent.subscribe(params_ => {
    //   console.log(params_)
    //   // this.email_id = params.email_id;
    //   // console.log(this.email_id)
    // })

  }

}
