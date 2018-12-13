import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthorizationService {
  public accessToken;
  public ip = 'http://10.0.1.10:3000';

  constructor(private http: HttpClient) {
    if (localStorage.getItem('authorizationToken') === null) {
      this.authorization();
      return;
    } else {
      const state = JSON.parse(localStorage.getItem('authorizationToken'));
      this.accessToken = state.accessToken;
   }
  }

  private stateServ() {
      const objState = {
        accessToken: this.accessToken,
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
        this.stateServ();
    });
}

}
