export interface Carta {
  id: number;
  numero: string;
  titolare: string;
  codUtente:string;
  tipo:string;
  scadenza: string;
  pin: string;
  stato: string;
  iban:string;
  mostraPin?: boolean; 
}