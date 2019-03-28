import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import {Subscription, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AuthorizationService } from '../../authorization.service';
import {global_params} from '../../global';
import { FormControl, Validators, FormBuilder, FormGroup} from '@angular/forms';
import { EmailServiceService } from '../email-service.service';
import { ToastrService} from 'ngx-toastr';


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

  // public email_selected: FormControl = new FormControl('', [Validators.required]);
  // public sign_selected: FormControl = new FormControl('', [Validators.required]);
  public sign_form: FormGroup;
  succes_search_flag = false;
  not_succes_search_flag = false;
  selected_checkbox_for_html = [];
  id_selected_letter: Array<number> = [];
  submitted: Boolean = false;
  constructor(
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    @Inject(AuthorizationService) private authorizationServ: AuthorizationService,
    @Inject(EmailServiceService) public emailServ: EmailServiceService,
    @Inject(ToastrService) private toastrServ: ToastrService,
    private formBuilder: FormBuilder

    ) {

     }

  ngOnInit() {
    this.sign_form = this.formBuilder.group({
      email_selected: ['', [Validators.required]],
      sign_selected: ['', [Validators.required]]
    });

    this.httpPost(`${global_params.ip}/mail/box`, {} , {contentType: 'application/json'}).subscribe((data) => {
      console.log(data);
      this.emailServ.signature_list = data.signatures;
    });

      this.subscription = this.activatedRoute.queryParams.subscribe(params => {
        this.global_sett = params.sett;
        if (this.global_sett === 'true') {
          if (!this.email_address) {
          this.httpPost(`${global_params.ip}/mail/box`, {} , {contentType: 'application/json'}).subscribe((data) => {
            this.email_address = data.boxes.map(val => {
              return val.address;
            });
            this.sign_form.controls.email_selected.setValue(this.email_address[0]);
          });
        }
        }

      });
  }

  public httpPost(url: string, body, options?): Observable<any> {
    return this.http.post(url, body, {headers: {Authorization: `Bearer ${this.authorizationServ.accessToken}`}});
  }

  get valid() {
    return this.sign_form.controls;
  }



  change__signature() {
    this.submitted = true;
    if (this.sign_form.invalid) {
      this.toastrServ.error('Выберите подпись');
      return;
    }
    this.httpPost(`${global_params.ip}/mail/signature/address`, {
      signatureId: +this.sign_form.controls.sign_selected.value,
      address: this.sign_form.controls.email_selected.value}).subscribe((data) => {
        this.toastrServ.show('Подпись назначена');
      });
  }


}
