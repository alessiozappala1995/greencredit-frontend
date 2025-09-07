import { ApplicationConfig, provideZoneChangeDetection, APP_INITIALIZER  } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { KeycloakService }from '../app/keycloak/keycloak.service';

export function initializeKeycloak(keycloak: KeycloakService) {
  return () => keycloak.init();
}


export const appConfig: ApplicationConfig = {
  providers: [
	 provideZoneChangeDetection({ eventCoalescing: true }),
	 provideRouter(routes),
	 provideClientHydration(),
	 provideAnimationsAsync(),
	 provideHttpClient(withFetch()),
	 {
       provide: APP_INITIALIZER,
       useFactory: initializeKeycloak,
       deps: [KeycloakService],
       multi: true,
	 },
 ]
};
