import { inject, PLATFORM_ID, Inject, Injectable, Injector } from '@angular/core';
import Keycloak from 'keycloak-js';
import { FeaturesService } from '../features/services/features.service';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class KeycloakService {
	private keycloak: Keycloak | undefined;
	isLoading = false;
	private sessionReadySubject = new BehaviorSubject<boolean>(false);
	sessionReady$ = this.sessionReadySubject.asObservable();

	indirizzo: string = 'http://localhost:8080/';
	private apiUrlAuth = this.indirizzo + 'auth';

	constructor(
		@Inject(PLATFORM_ID) private platformId: Object,
		@Inject(DOCUMENT) private document: Document,
		private http: HttpClient
	) { }

	init(): Promise<boolean> {
		if (!isPlatformBrowser(this.platformId)) {
			return Promise.resolve(true);
		}

		this.keycloak = new Keycloak({
			url: 'http://localhost:8098',
			realm: 'greencredit',
			clientId: 'client_id'
		});

		return this.keycloak.init({
			onLoad: 'login-required',
			pkceMethod: 'S256',
			redirectUri: window.location.origin + '/dashboard/oauth2/code/keycloak'
		}).then(authenticated => {
			console.log('Keycloak initialized', authenticated);
			this.handleSession();
			return authenticated;
		}).catch(err => {
			console.error('Keycloak init error', err);
			return false;
		});
	}

	private getAuthHeaders(): HttpHeaders {
		const token = this.getToken() ?? '';
		return new HttpHeaders({
			Authorization: `Bearer ${token}`
		});
	}

	private handleSession() {
		const localStorage = this.document.defaultView?.localStorage;

		if (!localStorage) return;

		const sessionID = localStorage.getItem('sessionID');
		if (!sessionID) {

			this.http.get<any>(`${this.apiUrlAuth}/session`, { headers: this.getAuthHeaders() }).subscribe({
				next: data => {
					localStorage.setItem('sessionID', data.sessionID);
					localStorage.setItem('numeroConto', data.numero_conto);
					this.sessionReadySubject.next(true);
				},
				error: () => {
					this.sessionReadySubject.next(false);
				}
			});
		}else {
			// Sessione già presente
			this.sessionReadySubject.next(true);
		}

	}

	getToken(): string | undefined {
		return this.keycloak?.token;
	}

	logout(): void {
		this.keycloak?.logout();
	}
}
