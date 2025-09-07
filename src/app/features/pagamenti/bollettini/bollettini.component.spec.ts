import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BollettiniComponent } from './bollettini.component';

describe('BollettiniComponent', () => {
  let component: BollettiniComponent;
  let fixture: ComponentFixture<BollettiniComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BollettiniComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BollettiniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
