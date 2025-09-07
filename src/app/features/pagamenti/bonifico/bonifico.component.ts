import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Subscription, forkJoin } from 'rxjs';
import { FeaturesService } from '../../services/features.service';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { PopupComponent } from '../../../shared/components/popup/popup.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';

@Component({
	selector: 'app-bonifico',
	standalone: true,
	imports: [
		MatCardModule,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
		CommonModule,
		ReactiveFormsModule,
		PopupComponent,
		ModalComponent
	],
	templateUrl: './bonifico.component.html',
	styleUrls: ['./bonifico.component.css']
})

export class BonificoComponent implements OnInit, OnDestroy {

	@ViewChild(ModalComponent) modal!: ModalComponent;

	contoInfo: any
	numeroConto: any
	infoConto: any
	saldo: any
	saldoBonifico: any
	utenteConto: any
	private subscription?: Subscription;

	// form bonifico
	data: any
	iban: any
	beneficiario: any
	importo: any
	causale: any
	bonificoForm!: FormGroup<any>;

	popupTitle = '';
	popupMessage = '';
	popupTest = '';
	popupColor = '';
	isPopupVisible = false;


	constructor(private service: FeaturesService) { }

	ngOnInit() {

		this.infoBonifico();

		this.bonificoForm = new FormGroup({
			beneficiario: new FormControl('', [Validators.required]),
			iban: new FormControl('', [Validators.required]),
			importo: new FormControl('', [Validators.required]),
			data: new FormControl(new Date().toISOString()),
			causale: new FormControl('', [Validators.required]),
			contoAssociatoId: new FormControl(this.numeroConto),
		});
	}

	infoBonifico() {
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

	inviaBonifico() {

		if (this.bonificoForm?.valid) {
			this.modal.open();
		}
	}
	
	get dataSolo() {
	  return this.bonificoForm.get('data')?.value?.split('T')[0];
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


	onConfermato(numero: string) {
		const datiBonifico = this.bonificoForm?.value;
		this.service.postBonifico(datiBonifico).subscribe({
			next: (response) => {
				console.log('Bonifico inviato con successo:');
				this.mostraPopupDinamico('Il bonifico è stato eseguito correttamente. Puoi trovare i dettagli della transazione nei tuoi ultimi movimenti.', 'Bonifico completato', '#e6f4ea', '#0d0d0d');
				
			},
			error: (error) => {
				this.mostraPopupDinamico('Si è verificato un errore durante l\'elaborazione del bonifico. Verifica i dati inseriti o riprova più tardi.', 'Errore durante il bonifico', '#f8d7da', '#000000');
				console.error('Errore durante l\'invio del bonifico:', error);
			}
		});
	}

	ngOnDestroy() {
		if (this.subscription) {
			this.subscription.unsubscribe();
		}
	}
}
