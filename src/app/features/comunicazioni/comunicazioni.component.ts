import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { FeaturesService } from '../services/features.service';
import { forkJoin, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-comunicazioni',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatCardModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    MatListModule
  ],
  templateUrl: './comunicazioni.component.html',
  styleUrls: ['./comunicazioni.component.css']
})
export class ComunicazioniComponent implements OnInit, AfterViewInit, OnDestroy {

 displayedColumns: string[] = ['data', 'messaggio'];
 dataSource = new MatTableDataSource<any>([]);
 private subscription?: Subscription;
 contoInfo:any

  avvisi: any[] = [];
  notifiche: any[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private service: FeaturesService) {}

  ngOnInit() {
    this.avvisi = [
      { title: "Verifica richiesta", desc: "Aggiorna le informazioni del tuo profilo per maggiore sicurezza.", color: "accent", icon: "info" },
      { title: "Manutenzione programmata", desc: "Il sistema sarà offline il 10/11 dalle 01:00 alle 03:00.", color: "warn", icon: "build" },
      { title: "Aggiornamento App", desc: "È in programma una nuova versione dell'app GreenBank.", color: "primary", icon: "system_update" },
      { title: "Nuove funzionalità", desc: "Presto saranno disponibili nuovi strumenti di gestione", color: "accent", icon: "new_releases" },
      { title: "Verifica dispositivo", desc: "Abbiamo rilevato un nuovo dispositivo collegato al tuo account.", color: "warn", icon: "devices" },
      { title: "Notifica di sicurezza", desc: "Ti consigliamo di cambiare la password ogni 3 mesi.", color: "accent", icon: "security" }
    ];

    this.loadNotifiche();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

   loadNotifiche() {
     const numeroConto = localStorage.getItem('numeroConto');
     if (!numeroConto) return;

     this.subscription = forkJoin({
       conto: this.service.getInfoContoByNumero(numeroConto),
       messaggi: this.service.getComunicazioni(numeroConto)
     }).subscribe({
       next: ({ conto, messaggi }) => {
         this.contoInfo = { conto, messaggi };
         this.notifiche = messaggi;
         this.dataSource.data = messaggi;
         console.log(this.contoInfo)
       },
       error: (err) => {
         console.error('Errore nel recupero delle informazioni:', err);
       }
     });
   }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

}
