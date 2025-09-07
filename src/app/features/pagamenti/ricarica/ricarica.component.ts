import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Subscription, forkJoin } from 'rxjs';
import { FeaturesService } from '../../services/features.service';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { PopupComponent } from '../../../shared/components/popup/popup.component'
import { ModalComponent } from '../../../shared/components/modal/modal.component';


@Component({
	selector: 'app-ricarica',
	standalone: true,
	imports: [
		MatCardModule,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
		CommonModule,
		ReactiveFormsModule,
		MatSelectModule,
		PopupComponent,
		ModalComponent
	],
	templateUrl: './ricarica.component.html',
	styleUrl: './ricarica.component.css'
})
export class RicaricaComponent implements OnInit, OnDestroy {

	@ViewChild(ModalComponent) modal!: ModalComponent;

	contoInfo: any
	numeroConto: any
	infoConto: any
	saldo: any
	saldoBonifico: any
	utenteConto: any
	private subscription?: Subscription;

	// form ricarica
	data: any
	operatore: any
	importoRicarica: any
	causale: any
	ricaricaForm!: FormGroup<any>;

	popupTitle = '';
	popupMessage = '';
	popupTest = '';
	popupColor = '';
	isPopupVisible = false;

	constructor(private service: FeaturesService) { }

	ngOnInit() {
		this.infoRicarica();

		this.ricaricaForm = new FormGroup({
			operatore: new FormControl('', [Validators.required]),
			numero: new FormControl('', [Validators.required]),
			causale: new FormControl(['Ricarica telefonica']),
			data: new FormControl(new Date().toISOString()),
			importo: new FormControl('', [Validators.required]),
			contoAssociatoId: new FormControl(this.numeroConto),
		});
	}

	infoRicarica() {
		this.numeroConto = localStorage.getItem('numeroConto')

		this.subscription = forkJoin({
			conto: this.service.getInfoContoByNumero(this.numeroConto),
			utenti: this.service.getInfoUtenti(this.numeroConto),

		}).subscribe({
			next: (responses: any) => {

				this.contoInfo = {
					utenti: responses.utenti,
				};

				this.numeroConto = responses.conto.numero
				this.saldo = responses.conto.saldo
				this.infoConto = responses.conto.tipo
			},
			error: (error: any) => {
				console.error('Errore nel recupero delle informazioni:', error);
			},
		});
	}

	inviaRicarica() {

		if (this.ricaricaForm?.valid) {
			this.modal.open();
		}
	}

	onConfermato(numero: string) {
		const datiRicarica = this.ricaricaForm?.value;
		this.service.postRicarica(datiRicarica).subscribe({
			next: (response) => {
				this.mostraPopupDinamico('La ricarica stata eseguita correttamente. Puoi trovare i dettagli della transazione nei tuoi ultimi movimenti.', 'Ricarica completata', '#e6f4ea', '#0d0d0d');
			},
			error: (error) => {
				this.mostraPopupDinamico('Si è verificato un errore durante l\'elaborazione della ricarica. Verifica i dati inseriti o riprova più tardi.', 'Errore durante la ricarica', '#f8d7da', '#000000');
			}
		});
	}

	mostraPopupDinamico(messaggio: string, titolo: string, colore: string, coloreTesto: string) {
		this.popupTitle = titolo;
		this.popupMessage = messaggio;
		this.popupColor = colore;
		this.popupTest = coloreTesto;
		this.isPopupVisible = true;
	}

	chiudiPopup() {
		this.isPopupVisible = false;
	}

	ngOnDestroy() {
		if (this.subscription) {
			this.subscription.unsubscribe();
		}
	}
}