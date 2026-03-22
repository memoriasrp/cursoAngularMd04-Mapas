import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DestinoDetalle } from './destino-detalle';

describe('DestinoDetalle', () => {
  let component: DestinoDetalle;
  let fixture: ComponentFixture<DestinoDetalle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DestinoDetalle],
    }).compileComponents();

    fixture = TestBed.createComponent(DestinoDetalle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
