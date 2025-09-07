import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinanziamentiComponent } from './finanziamenti.component';

describe('FinanziamentiComponent', () => {
  let component: FinanziamentiComponent;
  let fixture: ComponentFixture<FinanziamentiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FinanziamentiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FinanziamentiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
