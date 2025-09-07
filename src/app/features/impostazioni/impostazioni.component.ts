import { Component, OnInit, OnDestroy, ViewChildren, QueryList} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FormControl, ReactiveFormsModule, FormGroup, Validators } from '@angular/forms';
import { PopupComponent } from '../../shared/components/popup/popup.component';
import { ModalComponent } from '../../shared/components/modal/modal.component';
import { FeaturesService } from '../services/features.service';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { KeycloakService } from '../../keycloak/keycloak.service';


@Component({
  selector: 'app-impostazioni',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PopupComponent,
    ModalComponent
  ],
  templateUrl: './impostazioni.component.html',
  styleUrls: ['./impostazioni.component.css']
})
export class ImpostazioniComponent implements OnInit, OnDestroy {

  nome_utente: string = '';
  cognome_utente: string = '';
  email_utente: string = '';
  contoAttivo:any;

  @ViewChildren(ModalComponent) modali!: QueryList<ModalComponent>;
  profileForm!: FormGroup;

  popupTitle = '';
  popupMessage = '';
  popupTest = '';
  popupColor = '';
  isPopupVisible = false;

  private currentUserData: any;

  constructor(private service: FeaturesService, private authService: KeycloakService) { }

  ngOnInit() {
    this.profileForm = new FormGroup({
      nome: new FormControl('', [Validators.required]),
      cognome: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
    });

    this.loadUserData();
  }

  loadUserData() {
    const numeroConto: string | null = localStorage.getItem('numeroConto');
    if (!numeroConto) return;

    forkJoin({
      conto: this.service.getInfoContoByNumero(numeroConto),
      utenti: this.service.getInfoUtenti(numeroConto)
    }).subscribe({
      next: ({ conto, utenti }) => {
        if (utenti && utenti.length > 0) {
          const user = utenti[0];
          this.currentUserData = { ...user };

          this.nome_utente = user.nome;
          this.cognome_utente = user.cognome;
          this.email_utente = user.email;

          this.profileForm.patchValue({
            nome: user.nome,
            cognome: user.cognome,
            email: user.email
          });
        }
        this.contoAttivo = conto.attivo;
      },
      error: (err) => {
        console.error('Errore caricamento utente o conto', err);
      }
    });
  }

  chiudiPopup() {
    this.isPopupVisible = false;
  }

  aggiornaProfilo() {
    if (this.profileForm?.valid) {
	  const modalEditUtente = this.modali.toArray()[0];
      modalEditUtente.open();
    }
  }

  onBloccaConto(numero: string){

      const numeroConto: any = localStorage.getItem('numeroConto');
      this.service.putDisattivaConto(numeroConto).subscribe({
        next: (response) => {
          this.mostraPopupDinamico("Il Conto è stato bloccato", 'Conto Bloccato', '#e6f4ea', '#0d0d0d');

           setTimeout(() => {
                this.authService.logout()
              }, 1500);
        },
        error: (error) => {
          this.mostraPopupDinamico("Si è verificato un errore durante l\'operazione di blocco. Riprova più tardi.", "Errore blocco Conto", '#f8d7da', '#000000');
        }
      });
  }

  onEditUtente(numero: string) {
    if (!this.currentUserData) return;

     const datiDaInviare = {
      ...this.currentUserData,
      nome: this.profileForm.value.nome,
      cognome: this.profileForm.value.cognome,
      email: this.profileForm.value.email
    };

    this.service.putUtenti(datiDaInviare).subscribe({
      next: (response) => {
		this.mostraPopupDinamico("L'utente è stato aggiornato correttamente", 'Utente Aggiornato', '#e6f4ea', '#0d0d0d');
        console.log('Profilo aggiornato con successo', response);
      },
      error: (error) => {
		this.mostraPopupDinamico("Si è verificato un errore durante l\'aggiornamento dell' utente. Verifica i dati inseriti o riprova più tardi.", "Errore durante l'aggiornamento", '#f8d7da', '#000000');
        console.error('Errore durante l\'aggiornamento del profilo', error);
      }
    });
  }

  bloccaConto(){
	const modalBloccaConto = this.modali.toArray()[1];
	modalBloccaConto.open();
  }

  mostraPopupDinamico(messaggio: string, titolo: string, colore: string, coloreTesto: string) {
    this.popupTitle = titolo;
    this.popupMessage = messaggio;
    this.popupColor = colore;
    this.popupTest = coloreTesto;
    this.isPopupVisible = true;
  }

  ngOnDestroy(): void { }
}
