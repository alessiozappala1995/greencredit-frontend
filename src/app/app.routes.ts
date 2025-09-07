import { Routes } from '@angular/router';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { HomeComponent } from './features/home/home.component';
import { ComunicazioniComponent } from './features/comunicazioni/comunicazioni.component';
import { ProfiloComponent } from './features/profilo/profilo.component';
import { ContiComponent } from './features/conti/conti.component';
import { PagamentiComponent } from './features/pagamenti/pagamenti.component';
import { FinanziamentiComponent } from './features/finanziamenti/finanziamenti.component';
import { CarteComponent } from './features/carte/carte.component';
import { ImpostazioniComponent } from './features/impostazioni/impostazioni.component';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [  
	{ path: '', redirectTo: '/dashboard', pathMatch: 'full' },
	{ 
	  path: 'dashboard',
	  component: DashboardComponent,
	  children: [
	    { path: '', redirectTo: 'home', pathMatch: 'full' },
	    { path: 'home', component: HomeComponent },
	    { path: 'comunicazioni', component: ComunicazioniComponent, canActivate: [AuthGuard] },
	    { path: 'profilo', component: ProfiloComponent, canActivate: [AuthGuard] },
	    { path: 'conti', component: ContiComponent, canActivate: [AuthGuard] },
	    { path: 'pagamenti', component: PagamentiComponent, canActivate: [AuthGuard] },
	    { path: 'finanziamenti', component: FinanziamentiComponent, canActivate: [AuthGuard] },
	    { path: 'carte', component: CarteComponent, canActivate: [AuthGuard] },
		{ path: 'impostazioni', component: ImpostazioniComponent, canActivate: [AuthGuard] }
	  ]
	},
	{ path: '**', redirectTo: '/dashboard/home' }
	
];
