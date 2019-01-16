import { Injectable, Inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthorizationService } from './../authorization.service';

@Injectable({
  providedIn: 'root'
})
export class EmailGuardGuard implements CanActivate {

  constructor(
    @Inject(AuthorizationService) private authorizationServ: AuthorizationService,
    private rout: Router
    ) {
    }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authorizationServ.accessToken !== undefined) {
      return true;
    } else {
      this.rout.navigate(['not_f']);
      return false;
    }
  }
}
