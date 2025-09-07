import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './popup.component.html',
  styleUrl: './popup.component.css'
})
export class PopupComponent {
	
	@Input() title: string = 'Welcome to the Popup!';
	@Input() message: string = 'This is a simple popup component in Angular.';
	@Input() overlayColor: string = 'rgba(0,0,0,0.5)';
	@Input() popupBgColor: string = '#fff';
	@Input() popupTextColor: string = '#000';
	
	@Output() close = new EventEmitter<void>();

	closePopup() {
		this.close.emit();
	 }
}
