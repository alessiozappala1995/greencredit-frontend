import { Component, OnInit, OnDestroy } from '@angular/core';
import { FeaturesService } from '../services/features.service';
import { CommonModule } from '@angular/common';

@Component({
	selector: 'app-profilo',
	standalone: true,
	imports: [CommonModule],
	templateUrl: './profilo.component.html',
	styleUrl: './profilo.component.css'
})
export class ProfiloComponent implements OnInit, OnDestroy {

	users:any
	
	codice_utente:string = ""
	nome_utente:string = ""
	cognome_utente:string = ""
	email_utente:string = ""
	telefono_utente:string = ""
	cellulare_utente:string = ""
	indirizzo_utente:string = ""
	citta_utente:string = ""
	provincia_utente:string = ""
	cap_utente:string = ""
	data_utente:string = ""
	cod_utente:string = ""
	nazione_utente:string = ""
	sesso_utente:string = ""
	email2_utente:string = ""
	descrizione_utente:string = ""

	constructor(private service: FeaturesService) { }

	ngOnInit(): void {
		this.getInfoUtenti()
	}

	getInfoUtenti() {
		
		const numeroConto:any  = localStorage.getItem('numeroConto')
		
		this.service.getInfoUtenti(numeroConto)
			.subscribe({
				next: (data) => {
					
					this.users = data;
					this.codice_utente = this.users[0].codiceUtente;
					this.nome_utente = this.users[0].nome;
					this.cognome_utente = this.users[0].cognome;
					this.cod_utente = this.users[0].codiceFiscale;
					this.data_utente = this.users[0].anno;
					this.email_utente= this.users[0].email;
					this.cellulare_utente= this.users[0].telefono;
				},
				error: (err) => console.error('Errore caricamento utenti', err)
		});
	}


	ngOnDestroy(): void {

	}
}
