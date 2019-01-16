import { Component, OnInit, DoCheck, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { AuthorizationService } from '../../authorization.service';


@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.scss']
})
export class NewUserComponent implements OnInit, DoCheck {

  constructor(private fb: FormBuilder,
    private http: HttpClient,
    @Inject(AuthorizationService) private authorizationServ: AuthorizationService,
    ) { }


  private login_form_group: FormGroup;

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.login_form_group = this.fb.group({
      login: ['',
      Validators.email
    ],
      password: [null]
    });
  }

  ngDoCheck() {
    // console.log(this.login)
  }

  authorization() {
      this.authorizationServ.authorization(this.login_form_group.value.login, this.login_form_group.value.password);
  }

}
