import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Subscription, forkJoin } from 'rxjs';
import { FeaturesService } from '../../services/features.service';
import { FormControl, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { PopupComponent } from '../../../shared/components/popup/popup.component'
import { ModalComponent } from '../../../shared/components/modal/modal.component';


@Component({
	selector: 'app-bollettini',
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
	templateUrl: './bollettini.component.html',
	styleUrl: './bollettini.component.css'
})
export class BollettiniComponent implements OnInit, OnDestroy {

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
	bollettiniForm!: FormGroup<any>;
	tipoBollettino: any

	popupTitle = '';
	popupMessage = '';
	popupTest = '';
	popupColor = '';
	isPopupVisible = false;

	constructor(private service: FeaturesService) { }

	ngOnInit() {
		this.infoBollettini();

		this.bollettiniForm = new FormGroup({
			tipoBollettino: new FormControl('', [Validators.required]),
			tipologia: new FormControl('', [Validators.required]),
			causale: new FormControl(['Pagamento Bollettino']),
			importo: new FormControl('', [Validators.required]),
			data: new FormControl(new Date().toISOString()),
			cCorrente: new FormControl('', [Validators.required]),
			intestatario: new FormControl('', [Validators.required]),
			contoAssociatoId: new FormControl(this.numeroConto),
		});

		// Ascolto cambiamenti sul campo 'tipoBollettino'
		this.bollettiniForm.get('tipoBollettino')?.valueChanges.subscribe(tipo => {
			this.aggiornaForm(tipo);
		});

	}

	aggiornaForm(tipo: string) {
		if (tipo === 'compilare') {
			this.bollettiniForm.get('tipologia')?.setValue('123');
		} else if (tipo === 'precompilato') {
			this.bollettiniForm.get('tipologia')?.setValue('674');
		} else {
			null
		}
	};

	infoBollettini() {
		this.numeroConto = localStorage.getItem('numeroConto')

		forkJoin({
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
		})
	};

	inviaBollettini() {

		if (this.bollettiniForm?.valid) {
			this.modal.open();
		}
	}

	onConfermato(numero: string) {
		const datiRicarica = this.bollettiniForm?.value;
		this.service.postBollettino(datiRicarica).subscribe({
			next: (response) => {
				this.mostraPopupDinamico('Il pagamento è stata eseguito correttamente. Puoi trovare i dettagli della transazione nei tuoi ultimi movimenti.', 'Pagamento completato', '#e6f4ea', '#0d0d0d');
			},
			error: (error) => {
				this.mostraPopupDinamico('Si è verificato un errore durante l\'elaborazione del pagamento. Verifica i dati inseriti o riprova più tardi.', 'Errore durante il pagamento', '#f8d7da', '#000000');
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