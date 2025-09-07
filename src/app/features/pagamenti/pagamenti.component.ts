import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { NgIf } from '@angular/common';
import { ArchivioComponent } from './archivio/archivio.component'
import { BonificoComponent } from './bonifico/bonifico.component'
import { RicaricaComponent } from './ricarica/ricarica.component'
import { BollettiniComponent } from "./bollettini/bollettini.component";
import { CommonModule } from '@angular/common';
import {MatTabsModule} from '@angular/material/tabs';

@Component({
	selector: 'app-pagamenti',
	standalone: true,
	imports: [
		MatIconModule,
		RouterModule,
		MatCardModule,
		NgIf,
		ArchivioComponent,
		BonificoComponent,
		RicaricaComponent,
		BollettiniComponent,
		CommonModule,
		MatTabsModule
	],
	templateUrl: './pagamenti.component.html',
	styleUrl: './pagamenti.component.css'
})
export class PagamentiComponent {

	constructor() { }
}
