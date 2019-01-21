import { Component, OnInit, DoCheck, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { AuthorizationService } from './../authorization.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html',
  styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent implements OnInit, DoCheck {

  constructor(private fb: FormBuilder,
    private http: HttpClient,
    @Inject(AuthorizationService) private authorizationServ: AuthorizationService,
    ) { }


  private login_form_group: FormGroup;
  private authorization_error: Subscription;

  ngOnInit() {
    this.initForm();
    this.authorization_error = this.authorizationServ.error_response.subscribe(val => { // подписываюсь
      if (val) {
          alert('Не залогинет'); // если ошибка авторизации - написать
          this.login_form_group.reset();
      }
    });
  }

  initForm() {
    this.login_form_group = this.fb.group({
      login: ['',
      [Validators.email,
        Validators.required]
    ],
      password: ['',
      Validators.required
    ]
    });
  }

  ngDoCheck() {
    // console.log(this.login)
  }

  authorization() {

    if (this.login_form_group.invalid) {
        alert('Введите корректные данные');
        return;
    }


        this.authorizationServ.authorization(this.login_form_group.value.login, this.login_form_group.value.password);



  }


}
