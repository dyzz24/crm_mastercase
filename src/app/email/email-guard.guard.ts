import { Injectable, Inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthorizationService } from './../authorization.service';

@Injectable({
  providedIn: 'root'
})
export class EmailGuardGuard implements CanActivate {

  constructor(
    @Inject(AuthorizationService) private authorizationServ: AuthorizationService,
    ) {
    }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authorizationServ.accessToken !== undefined) {
      return true;
    } else {
      return false;
    }
  }
}
