import { Component, EventEmitter, output, Output } from '@angular/core';
import { DestinoViaje } from '../destino-viaje/destino-viaje';
import { DestinoViajes } from '../models/destino-viaje.model';
import { FormDestinoViaje } from '../form-destino-viaje/form-destino-viaje';
import { DestinosApiClient } from '../models/destinos-api-client.model';
import { DestinosViajesState } from '../store/destinos/destinos.state'

import { Store } from '@ngrx/store';
import { ElegidoFavoritoAction, NuevoDestinoAction, EliminarDestinoAction } from '../store/destinos/destinos.actions';
//import {AppState} from '../app.module';
@Component({
  selector: 'app-lista-destinos',
  imports: [DestinoViaje, FormDestinoViaje],
  templateUrl: './lista-destinos.html',
  styleUrl: './lista-destinos.css',
})
export class ListaDestinos {
  @Output() onItemAdded: EventEmitter<DestinoViajes>;
  update: string[];
  constructor(private destinoApiClient: DestinosApiClient, private store: Store<{ destinos: DestinosViajesState }>
  ) {
    this.onItemAdded = new EventEmitter();
    this.update = [];
    this.store.select(state => state.destinos.favorito).
      subscribe(d => {
        if (d != null) {
          this.update.push('Se eligio a' + d.nombre);
        }
      })

  }
  agregado(d: DestinoViajes) {
    this.destinoApiClient.add(d);
    this.onItemAdded.emit(d);
    this.store.dispatch(new NuevoDestinoAction(d));
    this.update.push('Se agregó ' + d.nombre);

  }

  elegido(d: DestinoViajes) {
    this.destinoApiClient.elegir(d);
    this.store.dispatch(new ElegidoFavoritoAction(d));
  }

  get destinos() {
    return this.destinoApiClient.destinos;
  }
eliminarDestino(d: DestinoViajes) {
  // 1. Eliminar del API client
  this.destinoApiClient.eliminar(d);

  // 2 también puedes despachar una acción NgRx
   this.store.dispatch(new EliminarDestinoAction(d));
   this.update.push('Se eliminó ' + d.nombre);

}

}
