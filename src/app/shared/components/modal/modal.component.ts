import { Component, EventEmitter, Output, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PopupComponent } from '../popup/popup.component';
import { FeaturesService } from '../../../features/services/features.service';
import { Subscription, forkJoin} from 'rxjs';

@Component({
	selector: 'app-modal',
	standalone: true,
	imports: [
		FormsModule,
		CommonModule,
		PopupComponent
	],

	templateUrl: './modal.component.html',
	styleUrl: './modal.component.css'
})
export class ModalComponent implements OnInit, OnDestroy {

	inputConto: string = '';
	isVisible: boolean = false;
	popupTitle = '';
	popupMessage = '';
	popupTest = '';
	popupColor = '';
	isPopupVisible = false;
	codiceUtente:any
	private subscription?: Subscription;

	constructor( private service: FeaturesService ) { }

	@Output() confermato = new EventEmitter<string>();

	ngOnInit(): void {
		this.getUserInfo()
	}
	
	getUserInfo() {
		const contoNumero: any = localStorage.getItem('numeroConto')
		if (contoNumero != null) {
			this.subscription = forkJoin({
				utenti: this.service.getInfoUtenti(contoNumero),
			}).subscribe({
				next: (response: any) => {
					this.codiceUtente = response.utenti[0].codiceUtente
				},
				error: (error: any) => {
					console.error('Errore nel recupero delle informazioni:', error);
				}
			});
		}
	}

	open() {
		this.isVisible = true;
	}

	closeModal() {
		this.isVisible = false;
	}

	conferma() {

		if (this.codiceUtente === Number(this.inputConto)) {
			this.confermato.emit(this.inputConto);
			this.closeModal();
			this.inputConto = ""

		} else {
			this.isPopupVisible = true;
			this.mostraPopupDinamico('Si è verificato un errore durante l\'inserimento del codice utente. Verifica i dati inseriti o riprova più tardi.', 'Codice utente non valido', '#f8d7da', '#000000');
		}
	}

	chiudiPopup() {
		this.isPopupVisible = false;
	}

	mostraPopupDinamico(messaggio: string, titolo: string, colore: string, coloreTesto: string) {
		this.popupTitle = titolo;
		this.popupMessage = messaggio;
		this.popupColor = colore;
		this.popupTest = coloreTesto;
		this.isPopupVisible = true;
	}

	ngOnDestroy(): void {
		if (this.subscription) {
			this.subscription.unsubscribe();
		}
	}

}