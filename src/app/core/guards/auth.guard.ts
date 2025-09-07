import { Injectable, Inject } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { KeycloakService } from '../../keycloak/keycloak.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private router: Router,
    private keycloakService: KeycloakService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {

    const localStorage = this.document.defaultView?.localStorage;

    if (localStorage?.getItem('numeroConto')) {
      return true;
    } else {
      localStorage?.clear();
      this.keycloakService.logout();
      return false;
    }
  }
}
