import { Component,OnInit, OnDestroy, Inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './core/navbar/navbar.component';
import { MatButtonModule } from '@angular/material/button';
import { FooterComponent } from './core/footer/footer.component';
import { MatIconModule } from '@angular/material/icon';
import { FeaturesService } from './features/services/features.service';
import { Subscription } from 'rxjs';
import { CommonModule, DOCUMENT } from '@angular/common';
import { Router } from '@angular/router';

@Component({
	selector: 'app-root',
	standalone: true,
	imports: [RouterOutlet, MatButtonModule, FooterComponent, MatIconModule, NavbarComponent, CommonModule],
	templateUrl: './app.component.html',
	styleUrl: './app.component.css'
})
export class AppComponent{
  title = 'ecobank-frontend';
  
  private subscription?: Subscription;

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private service: FeaturesService,
	private router: Router
  ) {}
  
  isSidebarCollapsed = false;

  onSidebarToggle() {
	this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

}

