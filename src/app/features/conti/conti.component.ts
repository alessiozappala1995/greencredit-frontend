import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FeaturesService } from '../services/features.service';
import { forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { Transazioni } from '../../model/transazioni';
import { Subscription } from 'rxjs';

@Component({
	selector: 'app-conti',
	standalone: true,
	imports: [
		MatIconModule,
		CommonModule,
		RouterModule,
		MatCardModule,
		MatMenuModule,
		MatTableModule,
		MatPaginatorModule,
		NgIf,
		FormsModule,
		MatDatepickerModule,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
		MatNativeDateModule
	],
	templateUrl: './conti.component.html',
	styleUrls: ['./conti.component.css'],
})
export class ContiComponent implements OnInit, AfterViewInit, OnDestroy {

	contoInfo: any;
	errorMessage: string = '';
	displayedColumns: string[] = ['data', 'importo', 'tipo', 'descrizione'];
	dataSource = new MatTableDataSource<Transazioni>([]);
	dataInizio: Date | null = null;
	dataFine: Date | null = null;
	private subscription?: Subscription


	@ViewChild(MatPaginator) paginator!: MatPaginator;

	constructor(private service: FeaturesService) { }

	ngAfterViewInit() {
		this.dataSource.paginator = this.paginator;
	}

	ngOnInit() {
		this.getContoInfo();
	}

	getContoInfo() {
		const numeroConto:any  = localStorage.getItem('numeroConto')
		forkJoin({
			conto: this.service.getInfoContoByNumero(numeroConto),
			transazioni: this.service.getMovimenti(numeroConto),
		}).subscribe({
			next: (responses: any) => {
				this.contoInfo = {
					conto: responses.conto,
					transazioni: responses.transazioni,
				};
				this.dataSource.data = responses.transazioni.filter((t: any) => t.stato !== 'N');
			},
			error: (error: any) => {
				this.errorMessage = 'Si è verificato un errore durante il recupero dei dati.';
				console.error('Errore nel recupero delle informazioni:', error);
			},
		});
	}

	filtraMovimenti() {
		if (this.dataInizio && this.dataFine) {
			const inizio = new Date(this.dataInizio).getTime();
			const fine = new Date(this.dataFine).getTime();

			this.dataSource.data = this.contoInfo.transazioni.filter((movimento: any) => {
				const dataMovimento = new Date(movimento.data).getTime();
				return dataMovimento >= inizio && dataMovimento <= fine;
			});
		}
	}


	ngOnDestroy(): void {
		if (this.subscription) {
			this.subscription.unsubscribe();
		}
	}

}
