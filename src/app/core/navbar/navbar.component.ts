import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { KeycloakService } from '../../keycloak/keycloak.service';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { FeaturesService } from '../../features/services/features.service';

interface MenuItem {
	icon: string;
	label: string;
	link: string;
	type: string;
}

@Component({
	selector: 'app-navbar',
	standalone: true,
	imports: [
		MatIconModule,
		RouterModule,
		CommonModule,
		FormsModule,
		MatFormFieldModule,
		MatInputModule,
		MatMenuModule,
		MatButtonModule,
		MatDividerModule,

	],
	templateUrl: './navbar.component.html',
	styleUrl: './navbar.component.css'
})

export class NavbarComponent implements OnInit {

	searchQuery: string = '';
	utente: string = '';
	filteredMenuItems: MenuItem[] = [];
	contoNumero:any

	menuItems: MenuItem[] = [
		{ icon: 'home', label: 'Home', type: 'link', link: '/dashboard/home' },
		{ icon: 'account_balance', label: 'Conto', type: 'link', link: '/dashboard/conti' },
		{ icon: 'payments', label: 'Pagamenti', type: 'link', link: '/dashboard/pagamenti' },
		{ icon: 'credit_score', label: 'Carte', type: 'link', link: '/dashboard/carte' },
		{ icon: 'account_balance_wallet', label: 'Finanziamenti', type: 'link', link: '/dashboard/finanziamenti' },
		{ icon: 'notifications', label: 'Comunicazioni', type: 'link', link: '/dashboard/comunicazioni' },
		{ icon: 'person', label: 'Profilo', type: 'link', link: '/dashboard/profilo' },
		{ icon: 'settings', label: 'Impostazioni', type: 'link', link: '/dashboard/impostazioni' },
	];

	constructor(private service: KeycloakService, private featureService: FeaturesService,) { }

	ngOnInit() {
		this.filteredMenuItems = [...this.menuItems];
		this.getUserInfo();
	}

	getUserInfo() {

    if (typeof window !== 'undefined' && window.localStorage)
		   this.contoNumero = localStorage.getItem('numeroConto')

		if (this.contoNumero != null) {
			this.featureService.getInfoUtenti(this.contoNumero).subscribe({
				next: (response: any) => {
					this.utente = response[0].nome + ' ' +  response[0].cognome
				},
				error: (error: any) => {
					console.error('Errore nel recupero delle informazioni:', error);
				}
			});
		}
	}

	filterMenu() {
		const query = this.searchQuery.toLowerCase();
		this.filteredMenuItems = query
			? this.menuItems.filter(item => item.label.toLowerCase().includes(query))
			: [...this.menuItems];
	}

	logout() {
		this.service.logout()
	}
}
