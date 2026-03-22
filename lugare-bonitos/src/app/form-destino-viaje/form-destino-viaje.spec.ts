import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDestinoViaje } from './form-destino-viaje';

describe('FormDestinoViaje', () => {
  let component: FormDestinoViaje;
  let fixture: ComponentFixture<FormDestinoViaje>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormDestinoViaje],
    }).compileComponents();

    fixture = TestBed.createComponent(FormDestinoViaje);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
