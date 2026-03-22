import { Component, EventEmitter, output, Output } from '@angular/core';
import { DestinoViaje } from '../destino-viaje/destino-viaje';
import { DestinoViajes } from '../models/destino-viaje.model';
import { FormDestinoViaje } from '../form-destino-viaje/form-destino-viaje';
import { DestinosApiClient } from '../models/destinos-api-client.model';
@Component({
  selector: 'app-lista-destinos',
  imports: [DestinoViaje, FormDestinoViaje],
  templateUrl: './lista-destinos.html',
  styleUrl: './lista-destinos.css',
})
export class ListaDestinos {
  @Output() onItemAdded: EventEmitter<DestinoViajes>;
  update: string[];
  constructor(private destinoApiClient: DestinosApiClient) {
    this.onItemAdded = new EventEmitter();
    this.update = [];
    this.destinoApiClient.subscribeOnChange((d: DestinoViajes) => {
      if (d != null) {
        this.update.push('Se eligio a' + d.nombre);
      }
    });
  }
  agregado(d: DestinoViajes) {
    //this.destinos.push(d);
    this.destinoApiClient.add(d);
    this.onItemAdded.emit(d);
  }

  elegido(d: DestinoViajes) {
    /* 
    this.destinos.forEach(function (x) { x.setSelected(false); })
    d.setSelected(true);
    */
    this.destinoApiClient.elegir(d);

  }

  get destinos() {
    return this.destinoApiClient.destinos;
  }

}
