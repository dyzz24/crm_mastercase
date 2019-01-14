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
  public lastName;
  public firstName;

  constructor(private http: HttpClient) {
    if (localStorage.getItem('authorizationToken') === null) {
      this.authorization();
      return;
    } else {
      const state = JSON.parse(localStorage.getItem('authorizationToken'));
      this.accessToken = state.accessToken;
      this.userId = state.userId;
      this.lastName = state.lastName;
      this.firstName = state.firstName;
   }
  }

  private stateServ() {
      const objState = {
        accessToken: this.accessToken,
        userId: this.userId,
        lastName: this.lastName,
        firstName: this.firstName
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
        this.lastName = data.lastName;
        this.firstName = data.firstName;
        this.stateServ();
    });
}

}
