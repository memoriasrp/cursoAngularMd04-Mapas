import { TrackearClick } from './trackear-click';
import { ElementRef } from '@angular/core';

describe('TrackearClick', () => {
  it('should create an instance', () => {
    // Creamos un mock (simulacro) de ElementRef
    const mockElementRef = new ElementRef(document.createElement('div'));

    // Ahora sí le pasamos el argumento que pide el constructor
    const directive = new TrackearClick(mockElementRef);

    expect(directive).toBeTruthy();
  });
});
