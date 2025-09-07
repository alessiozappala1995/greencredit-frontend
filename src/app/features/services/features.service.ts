import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { KeycloakService } from '../../keycloak/keycloak.service'


@Injectable({
	providedIn: 'root'
})

export class FeaturesService {

	indirizzo: string = 'http://localhost:8080/';

	private apiUrlAuth = this.indirizzo + 'auth';
	private apiUrlConti = this.indirizzo + 'conti';
	private apiUrlUtenti = this.indirizzo + 'utenti';
	private apiUrlComunicazioni = this.indirizzo + 'comunicazioni';
	private apiUrlTransazioni = this.indirizzo + 'transazioni';
	private apiUrlCarte = this.indirizzo + 'carte';
	private apiUrlPagamenti = this.indirizzo + 'pagamenti';

	constructor(private http: HttpClient, private keycloakService: KeycloakService) { }

	private getAuthHeaders(): HttpHeaders {
		const token = this.keycloakService.getToken();
		return new HttpHeaders({
			'Authorization': `Bearer ${token}`
		});
	}

	// API Auth
	getInfoAccount(): Observable<any> {
		const headers = this.getAuthHeaders();
		return this.http.get<any>(`${this.apiUrlAuth}/session`, { headers });
	}

	getLogout(): Observable<any> {
		const headers = this.getAuthHeaders();
		return this.http.get<any>(`${this.apiUrlAuth}/logout`, { headers });
	}

	// API Conto
	getInfoContoByNumero(contoNumero: string): Observable<any> {
		const headers = this.getAuthHeaders();
		return this.http.get<any>(`${this.apiUrlConti}/numero/${contoNumero}`, { headers });
	}

	putDisattivaConto(numeroConto: string): Observable<any> {
		const headers = this.getAuthHeaders();
		return this.http.get<any>(`${this.apiUrlConti}/blocco/${numeroConto}`, { headers });
	}

	// API Transazioni
	getMovimenti(contoNumero: string): Observable<any> {
		const headers = this.getAuthHeaders();
		return this.http.get<any>(`${this.apiUrlTransazioni}/${contoNumero}`, { headers });
	}

	// API Utente
	getInfoUtenti(contoNumero: string): Observable<any> {
		const headers = this.getAuthHeaders();
		return this.http.get<any>(`${this.apiUrlUtenti}/info/${contoNumero}`, { headers });
	}

	putUtenti(dati:any): Observable<any> {
		const headers = this.getAuthHeaders();
		return this.http.put<any>(`${this.apiUrlUtenti}/modifica`, dati, { headers });
	}

	// API Comunicazioni
	getComunicazioni(contoNumero: string): Observable<any> {
		const headers = this.getAuthHeaders();
		return this.http.get<any>(`${this.apiUrlComunicazioni}/notifiche/${contoNumero}`, { headers });
	}

	// API Carte
	getInfoCarta(contoId: any): Observable<any> {
		const headers = this.getAuthHeaders();
		return this.http.get<any>(`${this.apiUrlCarte}/info/${contoId}`, { headers });
	}

	putBloccaCarta(contoId: number, cartaNumero: string): Observable<any> {
		const headers = this.getAuthHeaders();
		return this.http.put<any>(`${this.apiUrlCarte}/blocco/${contoId}/${cartaNumero}`, null, { headers });
	}

	// API Pagamenti
	postBonifico(dati: any) {
		const headers = this.getAuthHeaders();
		return this.http.post(`${this.apiUrlPagamenti}/bonifico`, dati, { headers });
	}

	postRicarica(dati: any) {
		const headers = this.getAuthHeaders();
		return this.http.post(`${this.apiUrlPagamenti}/ricarica`, dati, { headers });
	}

	postBollettino(dati: any) {
		const headers = this.getAuthHeaders();
		return this.http.post(`${this.apiUrlPagamenti}/bollettini`, dati, { headers });
	}
}
