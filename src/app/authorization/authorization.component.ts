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
    this.authorization_error = this.authorizationServ.error_response.subscribe(val => { // подписываюсь на отрицательный ответ от сервера
      if (val) {
          alert('Не корректные данные'); // если ошибка авторизации - написать
          this.login_form_group.reset(); // скидываю форму
      }
    });
    this.authorization_success = this.authorizationServ.success_response.subscribe(val => { // подписываюсь на положительный ответ от серв

         if (val) { // если всё введено правильно - переходит туда
          this.rout.navigate(['/home']);
         }

    });
  }
  ngOnDestroy() {
    this.authorization_success.unsubscribe(); // отписон
    this.authorization_error.unsubscribe();
  }

  initForm() {
    this.login_form_group = this.fb.group({ // инициализация группы инпутов формы
      login: ['',
      [Validators.email,
        Validators.required] // базовая валидация
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

    if (this.login_form_group.invalid) { // если введены плохие данные
        alert('Введите корректные данные');
        return;
    }
        this.authorizationServ.authorization(this.login_form_group.value.login, this.login_form_group.value.password); // если всё ок - отпр

  }

  toggle_password_show() {
    const password_inp = document.querySelector('.password');
    const current_attribute = password_inp.getAttribute('type');
    if (current_attribute === 'password') {
      password_inp.setAttribute('type', 'text');
    } else {
      password_inp.setAttribute('type', 'password');
    }
  }


}
