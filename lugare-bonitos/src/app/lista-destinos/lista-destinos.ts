import { Component, EventEmitter, Output } from '@angular/core';
import { DestinoViaje } from '../destino-viaje/destino-viaje';
import { DestinoViajes } from '../models/destino-viaje.model';
import { FormDestinoViaje } from '../form-destino-viaje/form-destino-viaje';

@Component({
  selector: 'app-lista-destinos',
  imports: [DestinoViaje, FormDestinoViaje],
  templateUrl: './lista-destinos.html',
  styleUrl: './lista-destinos.css',
})
export class ListaDestinos {
  destinos: DestinoViajes[];
  constructor() {
    this.destinos = [];
  }
  agregado(d: DestinoViajes) {
    this.destinos.push(d);
  }

  elegido(d: DestinoViajes) {
    this.destinos.forEach(function (x) { x.setSelected(false); })
    d.setSelected(true);

  }
}
