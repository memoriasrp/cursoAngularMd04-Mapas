import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Destinoviaje } from './destinoviaje';

describe('Destinoviaje', () => {
  let component: Destinoviaje;
  let fixture: ComponentFixture<Destinoviaje>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Destinoviaje],
    }).compileComponents();

    fixture = TestBed.createComponent(Destinoviaje);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
