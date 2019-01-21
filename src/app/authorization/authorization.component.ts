import { Component, OnInit, DoCheck, Inject, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { AuthorizationService } from '../authorization.service';
import { Router, ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-not-found',
  templateUrl: './authorization.component.html',
  styleUrls: ['./authorization.component.scss']
})
export class AuthorizationComponent implements OnInit, DoCheck, OnDestroy {

  constructor(private fb: FormBuilder,
    private http: HttpClient,
    @Inject(AuthorizationService) private authorizationServ: AuthorizationService,
    private rout: Router,
    ) { }


  private login_form_group: FormGroup;
  private authorization_error: Subscription;
  private authorization_success: Subscription;

  ngOnInit() {
    this.initForm();
    this.authorization_error = this.authorizationServ.error_response.subscribe(val => { // подписываюсь
      if (val) {
          alert('Не залогинет'); // если ошибка авторизации - написать
          this.login_form_group.reset();
      }
    });
    this.authorization_success = this.authorizationServ.success_response.subscribe(val => { // подписываюсь на положительный ответ от серв

         if (val) {
          this.rout.navigate(['/email']);
         }

    });
  }
  ngOnDestroy() {
    this.authorization_success.unsubscribe();
    this.authorization_error.unsubscribe();
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
