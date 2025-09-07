import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagamentiComponent } from './pagamenti.component';

describe('PagamentiComponent', () => {
  let component: PagamentiComponent;
  let fixture: ComponentFixture<PagamentiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PagamentiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PagamentiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
