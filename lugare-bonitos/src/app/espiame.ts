import { Directive, ElementRef, HostListener, Input, OnInit, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appEspiame]',
  standalone: true
})
export class EspiameDirective implements OnInit, OnDestroy {
  @Input() colorResaltado = 'yellow';
  constructor(private el: ElementRef) {
    console.log('0. Constructor: La directiva ha sido instanciada');
  }
  ngOnInit() {
    console.log('1. OnInit: El elemento con appEspiame ya está en la página');
    // Ejemplo: podrías poner un borde inicial
    this.el.nativeElement.style.border = '1px solid gray';
  }

  // Se ejecuta justo antes de que el elemento desaparezca
  ngOnDestroy() {
    console.log('2. OnDestroy: El elemento va a ser eliminado. ¡Adiós!');
    // Aquí podrías limpiar temporizadores o suscripciones si las tuvieras
  }

  @HostListener('mouseenter') onMouseEnter() {
    this.resaltar(this.colorResaltado);
  }

  // Escucha cuando el mouse sale
  @HostListener('mouseleave') onMouseLeave() {
    this.resaltar(null);
  }

  private resaltar(color: string | null) {
    this.el.nativeElement.style.backgroundColor = color;
  }
}
