import { Component } from '@angular/core';
import { DestinoViaje } from '../destino-viaje/destino-viaje';
import { DestinoViajes } from '../models/destino-viaje.model';

@Component({
  selector: 'app-lista-destinos',
  imports: [DestinoViaje],
  templateUrl: './lista-destinos.html',
  styleUrl: './lista-destinos.css',
})
export class ListaDestinos {
  destinos: DestinoViajes[];
  mensajeError = '';
  constructor() {
    this.destinos = [];
  }
  guardar(nombreInput: HTMLInputElement, urlInput: HTMLInputElement): boolean {
    const nombre = nombreInput.value;
    const url = urlInput.value;
    console.log("sdfsfs" + urlInput.value);
    if (!nombre || !url) {
      this.mensajeError = 'Falta completar todos los campos';

      // borrar mensaje después de 3 segundos
      setTimeout(() => {
        this.mensajeError = '';
      }, 3000);

      return false;
    }



    this.destinos.push(new DestinoViajes(nombre, url + "/380/230"));
    // limpiar inputs
    nombreInput.value = '';

    return false;
  }
  elegido(d: DestinoViajes) {
    this.destinos.forEach(function (x) { x.setSelected(false); })
    d.setSelected(true);

  }
}
