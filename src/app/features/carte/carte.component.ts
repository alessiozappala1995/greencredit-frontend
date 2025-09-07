import { Component, OnInit, ViewChildren, QueryList } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { PopupComponent } from '../../shared/components/popup/popup.component';
import { FeaturesService } from '../services/features.service';
import { ModalComponent } from "../../shared/components/modal/modal.component";
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { forkJoin, switchMap, of } from 'rxjs';
import { Carta } from '../../model/carta';

@Component({
  selector: 'app-carte',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
	
    MatIconModule,
    PopupComponent,
    MatCardModule,
    MatMenuModule,
    MatPaginatorModule,
    FormsModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule,
    ModalComponent
  ],
  templateUrl: './carte.component.html',
  styleUrls: ['./carte.component.css']
})
export class CarteComponent implements OnInit {

  @ViewChildren(ModalComponent) modali!: QueryList<ModalComponent>;

  popupTitle = '';
  popupMessage = '';
  popupTest = '';
  popupColor = '';
  isPopupVisible = false;
  cartainfo: any;
  numeroConto: any;

  isCardFlipped = false;
  carta!: Carta;

  constructor(private dialog: MatDialog, private service: FeaturesService) { }

  ngOnInit() {
    this.getInfoCarta();
  }

  getInfoCarta() {
    this.numeroConto = localStorage.getItem('numeroConto');

    if (!this.numeroConto) {
      console.error('numeroConto non trovato in localStorage');
      return;
    }

    this.service.getInfoContoByNumero(this.numeroConto).pipe(
      switchMap((conto: any) =>
        forkJoin({
          conto: of(conto),
          carta: this.service.getInfoCarta(conto.id),
          utenti: this.service.getInfoUtenti(this.numeroConto)
        })
      )
    ).subscribe({
      next: (response: any) => {
        console.log(response);
        this.carta = {
          id: response.carta[0].id,
          numero: response.carta[0].numeroCarta,
          codUtente: response.utenti[0].codiceUtente,
          tipo: response.carta[0].tipo,
          scadenza: response.carta[0].scadenza,
          stato: response.carta[0].attiva,
          titolare: response.utenti[0].nome + " " + response.utenti[0].cognome,
          iban: response.conto.iban,
          pin: '12345'
        };
      },
      error: (err) => console.error(err)
    });
  }

  // Apri il modal per il PIN
  flipCard() {
    if (!this.isCardFlipped) {
      const modalPin = this.modali.toArray()[0]; // prima modale
      modalPin.open();
    } else {
      this.isCardFlipped = false;
    }
  }

  // Evento conferma PIN
  onConfermatoPin(numero: string) {
    this.isCardFlipped = true;
  }

  // Apri il modal per blocco carta
  bloccaCarta() {
    const modalBlocco = this.modali.toArray()[1]; // seconda modale
    modalBlocco.open();
  }

  // Evento conferma blocco carta
  onConfermato(numero: string) {
    this.service.getInfoContoByNumero(this.numeroConto).pipe(
      switchMap((conto: any) =>
        forkJoin({
          conto: of(conto),
          carta: this.service.putBloccaCarta(conto.id, this.carta.numero)
        })
      )
    ).subscribe({
      next: (response: any) => {
        console.log(response);
        this.mostraPopupDinamico(
          'La carta è stata momentaneamente bloccata. Grazie per contribuire a un futuro più verde ',
          'Richiesta blocco carta ⚠️',
          '#fff3cd',
          '#856404'
        );
        this.getInfoCarta(); // aggiorna lo stato della carta
      },
      error: (error: any) => {
        console.error('Errore rest:', error);
      }
    });
  }

  richiediCarta() {
    this.mostraPopupDinamico(
      'La richiesta è stata approvata con successo. Grazie per contribuire a un futuro più verde ',
      'Richiesta nuova carta 🌱',
      '#e6f4ea',
      '#0d0d0d'
    );
  }

  apriRichiestaCustom() {
    this.mostraPopupDinamico(
      'La richiesta è stata approvata con successo. Grazie per contribuire a un futuro più verde ',
      'Richiesta green 🌱',
      '#e6f4ea',
      '#0d0d0d'
    );
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

  togglePin(carta: any) {
    carta.mostraPin = !carta.mostraPin;
  }
}
