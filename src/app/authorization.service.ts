import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router} from '@angular/router';
import { Observable } from 'rxjs';
import {global_params} from './global';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {
  public accessToken;
  public ip = global_params.ip;
  public userId;
  public name;

  constructor(private http: HttpClient) {
    if (localStorage.getItem('authorizationToken') === null) { // Если токена нет
      this.authorization(); // авторизуюсь
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

    public authorization() {
      this.httpPost(`${this.ip}/user/login`,
      {email: 'seo@insat.ru', password: '12345678'}, {contentType: 'application/json'}).subscribe((data) => {
        this.accessToken = data.accessToken;
        this.userId = data.userId;
        this.name = data.name;
        this.stateServ();
    });
}

}
