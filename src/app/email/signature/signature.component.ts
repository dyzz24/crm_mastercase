import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import {Subscription } from 'rxjs';


@Component({
  selector: 'app-signature',
  templateUrl: './signature.component.html',
  styleUrls: ['./signature.component.scss']
})
export class SignatureComponent implements OnInit {

  private email_id: string;
  private subscription: Subscription;
  constructor(
    private activatedRoute: ActivatedRoute,

    ) {

     }

  ngOnInit() {
      this.subscription = this.activatedRoute.params.subscribe(params => {
          this.email_id = params.email_id;

      });
  }

}
