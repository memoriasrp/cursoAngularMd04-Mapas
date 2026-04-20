import { Directive, ElementRef } from '@angular/core';
import { from, fromEvent } from 'rxjs';

@Directive({
  selector: '[appTrackearClick]',
  standalone: true
})
export class TrackearClick {
  private element: HTMLElement;

  constructor(private elRef: ElementRef) {
    console.log("inicio del constructor de TrackearClick");
    this.element = this.elRef.nativeElement;
    fromEvent(this.element, 'click').subscribe(
      evento => this.track(evento));
  }

  track(evento: Event) {
    const elemtTags = this.element.attributes.getNamedItem('data-trackear-tags')?.value.split(' ') || 'sin-valor';
    console.log('Click trackeado en:', this.element.tagName, 'con id:', this.element.id);
    console.log('Tags asociados:', elemtTags);
    // Aquí podrías enviar esta información a un servicio de análisis o registro
  }
}
