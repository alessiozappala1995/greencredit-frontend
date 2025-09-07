import { AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Finanziamento } from '../../model/finanziamenti';
import { Investimento } from '../../model/investimento';
import { PopupComponent } from '../../shared/components/popup/popup.component'
import Chart from 'chart.js/auto';
import { ModalComponent } from "../../shared/components/modal/modal.component";


@Component({
	selector: 'app-finanziamenti',
	standalone: true,
	imports: [
		CommonModule,
		PopupComponent,
		ModalComponent
	],
	templateUrl: './finanziamenti.component.html',
	styleUrl: './finanziamenti.component.css'
})
export class FinanziamentiComponent implements AfterViewInit {

	@ViewChild(ModalComponent) modal!: ModalComponent;
	popupTitle = '';
	popupMessage = '';
	popupTest = '';
	popupColor = '';
	isPopupVisible = false;
	finanziamenti = [
		{
			nome: 'Superbonus Energetico',
			descrizione: 'Detrazione fiscale del 90% per interventi di riqualificazione energetica come l’installazione di pannelli solari, cappotti termici o pompe di calore. Applicabile sia a privati che a imprese.',
			importoMax: '90% dei costi',
			importoMaxVal: 90,
			tasso: 0,
			categoria: 'Energia'
		},
		{
			nome: 'Credito d’Imposta per Impianti Green',
			descrizione: 'Credito d’imposta fino al 50% per l’acquisto e l’installazione di impianti fotovoltaici, sistemi di accumulo energetico e tecnologie a basso impatto ambientale. Valido fino al 31 dicembre 2025.',
			importoMax: '50% dei costi',
			importoMaxVal: 50,
			tasso: 0,
			categoria: 'Impianti Green'
		},
		{
			nome: 'Agevolazioni per Veicoli Elettrici',
			descrizione: 'Esenzione dall’IVA e contributi diretti per l’acquisto di veicoli elettrici o ibridi plug-in per uso aziendale. Benefici aggiuntivi per l’installazione di colonnine di ricarica.',
			importoMax: 'Variabile',
			importoMaxVal: 0,
			tasso: 0,
			categoria: 'Veicoli Elettrici'
		},
		{
			nome: 'Sgravi sui Contratti di Energia Rinnovabile',
			descrizione: 'Le aziende che sottoscrivono contratti per l’acquisto di energia da fonti rinnovabili possono beneficiare di tariffe agevolate e deduzioni fiscali sui costi energetici.',
			importoMax: 'Variabile',
			importoMaxVal: 0,
			tasso: 0,
			categoria: 'Energia'
		}
	];

	getCategorieCount() {
		const count: any = {};
		this.finanziamenti.forEach(f => {
			count[f.categoria] = (count[f.categoria] || 0) + 1;
		});
		return count;
	}

	richiediFinanziamento(f: any) {
		this.modal.open();
	}

	chiudiPopup() {
		this.isPopupVisible = false;
	}

	ngOnInit() { }

	ngAfterViewInit() {
		this.renderFinanziamentiChart();
		this.renderFinanziamentiPieChart();
	}

	renderFinanziamentiChart() {
		const ctx = document.getElementById('finanziamentiChart') as HTMLCanvasElement;
		new Chart(ctx, {
			type: 'bar',
			data: {
				labels: this.finanziamenti.map(f => f.nome),
				datasets: [{
					label: 'Importo Max',
					data: this.finanziamenti.map(f =>
						f.importoMaxVal === 0 ? 5 : f.importoMaxVal 
					),
					backgroundColor: this.finanziamenti.map(f =>
						f.importoMaxVal === 0
							? 'rgba(255, 206, 86, 0.6)' 
							: 'rgba(75, 192, 192, 0.6)' 
					),
					borderColor: this.finanziamenti.map(f =>
						f.importoMaxVal === 0
							? 'rgba(255, 206, 86, 1)'
							: 'rgba(75, 192, 192, 1)'
					),
					borderWidth: 1
				}]
			},
			options: {
				responsive: true,
				plugins: {
					legend: { display: false },
					title: { display: true, text: 'Importo Massimo Finanziamenti' },
					tooltip: {
						callbacks: {
							label: (context) => {
								const f = this.finanziamenti[context.dataIndex];
								return f.importoMaxVal === 0
									? 'Importo: Variabile'
									: `Importo: €${f.importoMaxVal.toLocaleString()}`;
							}
						}
					}
				},
				scales: {
					y: {
						beginAtZero: true,
						title: { display: true, text: 'Importo (€)' }
					}
				}
			}
		});
	}

	renderFinanziamentiPieChart() {
		const ctx = document.getElementById('finanziamentiPieChart') as HTMLCanvasElement;
		const categorieCount = this.getCategorieCount();

		new Chart(ctx, {
			type: 'pie',
			data: {
				labels: Object.keys(categorieCount),
				datasets: [{
					data: Object.values(categorieCount),
					backgroundColor: ['#4bc0c0', '#36a2eb', '#ffcd56', '#ff6384'],
					borderWidth: 1
				}]
			},
			options: {
				responsive: true,
				plugins: {
					legend: {
						display: true,
						position: 'right', 
					},
					title: {
						display: true,
						text: 'Distribuzione Finanziamenti per Categoria'
					}
				}
			}
		});
	}
	
	// evento modale
	onConfermato(numero: string) {
		this.isPopupVisible = true;
		this.mostraPopupDinamico('La richiesta di finanziamento è stata approvata con successo. Grazie per contribuire a un futuro più verde ', 'Richiesta di finanziamento 🌱', '#e6f4ea', '#0d0d0d');
	}

	// mostra il pop-up
	mostraPopupDinamico(messaggio: string, titolo: string, colore: string, coloreTesto: string) {
		this.popupTitle = titolo;
		this.popupMessage = messaggio;
		this.popupColor = colore;
		this.popupTest = coloreTesto;
		this.isPopupVisible = true;
	}

}
