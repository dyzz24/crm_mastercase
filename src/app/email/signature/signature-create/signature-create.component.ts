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

  }

}
