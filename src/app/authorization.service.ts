import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpRequest } from '@angular/common/http';
import { Router} from '@angular/router';
import { Observable } from 'rxjs';
import {global_params} from './global';
import { Subject } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {
  public accessToken;
  public ip = global_params.ip;
  public userId;
  public name;
  public error_response = new Subject<any>();
  public success_response = new Subject<any>();

  constructor(private http: HttpClient) {
    if (localStorage.getItem('authorizationToken') === null) { // Если токена нет
      this.authorization('seo@insat.ru', '12345678'); // авторизуюсь
      return;
    } else {
      const state = JSON.parse(localStorage.getItem('authorizationToken')); // если есть получаю
      this.accessToken = state.accessToken;
      // console.log(state);
      this.userId = state.userId;
      this.name = state.name;
   }
  }

  private stateServ() {
      const objState = {
        accessToken: this.accessToken,
        userId: this.userId,
        name: this.name,
      };
      localStorage.setItem('authorizationToken', JSON.stringify(objState));
    }

    private httpPost(url: string, body, options?): Observable<any> {
      return this.http.post(url, body, {headers: {}});
    }

    public authorization(email, password) {
      this.httpPost(`${this.ip}/user/login`,
      {email: email, password: password}, {contentType: 'application/json'}).subscribe((data => {
          this.accessToken = data.accessToken;
          this.userId = data.userId;
          this.name = data.name;
          this.stateServ();
          this.success_response.next(true);
      }
    ), (err: HttpErrorResponse) => { // если ошибка авторизации, отправляю в компонент что нельзя залогиниться
        this.error_response.next(err.error);

    });
}

}
