import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { EspiameDirective } from './espiame';
// 1. Creamos un componente "falso" para probar la directiva
@Component({
  standalone: true,
  imports: [EspiameDirective],
  template: `
    <div id="test-div" appEspiame colorResaltado="cyan">Contenido de prueba</div>
  `
})

class TestHostComponent { }

describe('EspiameDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let el: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, EspiameDirective]
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges(); // Renderiza el componente
    el = fixture.debugElement.query(By.directive(EspiameDirective));
  });

  // Prueba 1: Verificar que se crea
  it('debería crear una instancia', () => {
    const directive = el.injector.get(EspiameDirective);
    expect(directive).toBeTruthy();
  });

  // Prueba 2: Verificar el cambio de color al entrar (mouseenter)
  it('debería cambiar el fondo a "cyan" cuando el mouse entra', () => {
    // Simulamos el evento de entrada del mouse
    el.triggerEventHandler('mouseenter', null);
    fixture.detectChanges();

    const backgroundColor = el.nativeElement.style.backgroundColor;
    expect(backgroundColor).toBe('cyan');
  });

  // Prueba 3: Verificar que se limpia el color al salir (mouseleave)
  it('debería quitar el fondo cuando el mouse sale', () => {
    // Entramos y luego salimos
    el.triggerEventHandler('mouseenter', null);
    el.triggerEventHandler('mouseleave', null);
    fixture.detectChanges();

    const backgroundColor = el.nativeElement.style.backgroundColor;
    expect(backgroundColor).toBe(''); // O el valor por defecto
  });
});
