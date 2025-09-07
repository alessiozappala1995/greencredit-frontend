import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContiComponent } from './conti.component';

describe('ContiComponent', () => {
  let component: ContiComponent;
  let fixture: ComponentFixture<ContiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
