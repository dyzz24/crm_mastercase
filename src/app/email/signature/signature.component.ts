import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import {Subscription, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthorizationService } from '../../authorization.service';
import {global_params} from '../../global';
import { FormControl} from '@angular/forms';


@Component({
  selector: 'app-signature',
  templateUrl: './signature.component.html',
  styleUrls: ['./signature.component.scss']
})
export class SignatureComponent implements OnInit {

  private email_id: string;
  private subscription: Subscription;
  private global_sett: string;
  private email_address;

  public email_selected: FormControl = new FormControl('');
  public sign_selected: FormControl = new FormControl('');
  constructor(
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    @Inject(AuthorizationService) private authorizationServ: AuthorizationService,

    ) {

     }

  ngOnInit() {

      this.subscription = this.activatedRoute.queryParams.subscribe(params => {

        this.global_sett = params.sett;
        if (this.global_sett === 'true') {
          if (!this.email_address) {
          this.httpPost(`${global_params.ip}/mail/box`, {} , {contentType: 'application/json'}).subscribe((data) => {
            this.email_address = data.boxes.map(val => {
              return val.address;
            });
            this.email_selected.setValue(this.email_address[0]);
          });
        }
        }

      });
  }

  public httpPost(url: string, body, options?): Observable<any> {
    return this.http.post(url, body, {headers: {Authorization: `Bearer ${this.authorizationServ.accessToken}`}});
  }


}
