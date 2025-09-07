import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FeaturesService } from '../services/features.service';
import { forkJoin } from 'rxjs';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { Subscription } from 'rxjs';
import { CommonModule, DOCUMENT } from '@angular/common';
import Chart from 'chart.js/auto';
import { KeycloakService } from '../../keycloak/keycloak.service';
import { Router } from '@angular/router';


@Component({
	selector: 'app-home',
	standalone: true,
	imports: [
		MatIconModule,
		CommonModule,
		RouterModule,
		MatCardModule,
		MatMenuModule
	],
	templateUrl: './home.component.html',
	styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {

	contoInfo: any;
	isSaldoVisible: boolean = false;
	private subscription?: Subscription;
	private subscriptionSession?: Subscription;
	private transazioniChart: Chart | null = null;

	constructor(
		private keycloakService: KeycloakService,
		private service: FeaturesService,
		@Inject(DOCUMENT) private document: Document,
		private router: Router
	) { }

	dashboardCards = [
		{ title: 'Lista Movimenti', icon: 'list_alt', type: 'link', link: '/dashboard/conti', fragment: 'list-movimenti' },
		{ title: 'Finanziamenti', icon: 'show_chart', type: 'link', link: '/dashboard/finanziamenti', fragment: '' },
		{ title: 'Spese Recenti', icon: 'request_quote', type: 'link', link: '/dashboard/pagamenti', fragment: 'arch_pagamenti' },
		{ title: 'Azione Rapida', icon: 'menu', type: 'menu' }
	];

	navigateCard(card: any): void {
		if (card.type === 'link' && card.link) {
			this.router.navigate([card.link], { fragment: card.fragment });
		}
	}

	private preparaDatiTransazioni(transazioni: any[]) {
		const datiMensili: { [mese: string]: { entrate: number; uscite: number } } = {};

		transazioni.forEach(t => {
			const date = new Date(t.data);
			// Formato "YYYY-MM" per raggruppare per mese
			const mese = date.toISOString().slice(0, 7);

			if (!datiMensili[mese]) {
				datiMensili[mese] = { entrate: 0, uscite: 0 };
			}

			if (t.tipo.toLowerCase() === 'deposito') {
				datiMensili[mese].entrate += t.importo;
			} else {
				datiMensili[mese].uscite += t.importo;
			}
		});

		const mesiOrdinati = Object.keys(datiMensili).sort();

		const labels = mesiOrdinati;
		const entrate = mesiOrdinati.map(m => datiMensili[m].entrate);
		const uscite = mesiOrdinati.map(m => datiMensili[m].uscite);

		return { labels, entrate, uscite };
	}

	loadTransazioniChart(): void {
		const ctx = document.getElementById('transazioniChart') as HTMLCanvasElement;

		if (!ctx || !this.contoInfo?.transazioni) return;

		const { labels, entrate, uscite } = this.preparaDatiTransazioni(this.contoInfo.transazioni);

		if (this.transazioniChart) {
			// distruggo il grafico precedente se esiste
			this.transazioniChart.destroy();
		}

		this.transazioniChart = new Chart(ctx, {
			type: 'bar',
			data: {
				labels: labels,
				datasets: [
					{
						label: 'Entrate (€)',
						data: entrate,
						backgroundColor: 'rgba(27, 94, 32, 0.8)',
						borderColor: 'rgba(76, 175, 80, 1)',
					},
					{
						label: 'Uscite (€)',
						data: uscite,
						backgroundColor: 'rgba(244, 67, 54, 0.8)',
						borderColor: 'rgba(244, 67, 54, 1)',
					}
				]
			},
			options: {
				responsive: true,
				plugins: {
					legend: { position: 'bottom' }
				},
				scales: {
					y: {
						beginAtZero: true,
						ticks: {
							callback: value => `€${value}`
						}
					}
				}
			}
		});
	}

	loadCategoriaChart(): void {
		const ctx = document.getElementById('categoriaChart') as HTMLCanvasElement;
		if (!ctx || !this.contoInfo?.transazioni) return;

		// Raggruppa importi per tipo di transazione
		const spesePerTipo: { [tipo: string]: number } = {};

		this.contoInfo.transazioni.forEach((t:any) => {
			const tipo = t.tipo || 'Altro';
			if (!spesePerTipo[tipo]) {
				spesePerTipo[tipo] = 0;
			}
			spesePerTipo[tipo] += t.importo;
		});

		const labels = Object.keys(spesePerTipo);
		const data = labels.map(label => spesePerTipo[label]);

		const backgroundColors = [
		  'rgba(121, 134, 203, 1)',
		  'rgba(229, 115, 115, 1)',
		  'rgba(77, 208, 225, 1)',
		  'rgba(224, 224, 224, 1)',
		  'rgba(129, 199, 132, 1)',
		  'rgba(186, 104, 200, 1)',
		  'rgba(100, 181, 246, 1)',
		  'rgba(255, 183, 77, 1)',
		];

		new Chart(ctx, {
			type: 'doughnut',
			data: {
				labels: labels,
				datasets: [{
					label: 'Distribuzione per tipo',
					data: data,
					backgroundColor: backgroundColors.slice(0, labels.length),
					hoverOffset: 10
				}]
			},
			options: {
				responsive: true,
				plugins: {
					legend: { position: 'bottom' },
					tooltip: {
						callbacks: {
							label: function(context) {
								const value = context.raw as number;
								 return `${context.label}: €${value.toFixed(2)}`;
							}
						}
					}
				}
			}
		});
	}

	ngOnInit(): void {
		this.keycloakService.sessionReady$.subscribe(ready => {
			if (ready) {
				this.getUserInfo();
			}
		});
	}

	toggleSaldoVisibility() {
		this.isSaldoVisible = !this.isSaldoVisible;
	}

	getUserInfo() {
		const contoNumero: any = localStorage.getItem('numeroConto')
		if (contoNumero != null) {
			this.subscription = forkJoin({
				conto: this.service.getInfoContoByNumero(contoNumero),
				utenti: this.service.getInfoUtenti(contoNumero),
				messaggi: this.service.getComunicazioni(contoNumero),
				transazioni: this.service.getMovimenti(contoNumero),
			}).subscribe({
				next: (responses: any) => {
					this.contoInfo = {
						conto: responses.conto,
						utenti: responses.utenti,
						messaggi: responses.messaggi,
						transazioni: responses.transazioni
					};

					if(this.contoInfo.conto.attivo === false){
              this.keycloakService.logout()
          }

					// con le seguenti funzioni si caricano i due grafici
					this.loadTransazioniChart();
					this.loadCategoriaChart();
				},
				error: (error: any) => {
					console.error('Errore nel recupero delle informazioni:', error);
				}
			});
		}
	}

	ngOnDestroy(): void {
		if (this.subscription) {
			this.subscription.unsubscribe();
		}
		if (this.subscriptionSession) {
			this.subscriptionSession.unsubscribe();
		}
		if (this.transazioniChart) {
			this.transazioniChart.destroy();
		}
	}
}
