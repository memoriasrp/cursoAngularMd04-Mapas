import { Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { DestinoViajes } from '../../models/destino-viaje.model';
import { nuevoDestino, elegidoFavorito, eliminarDestino } from '../../store/destinos/destinos.actions';
import { DestinosViajesState } from '../../store/destinos/destinos.state';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormDestinoViaje } from '../form-destino-viaje/form-destino-viaje';
import { DestinoViaje } from '../destino-viaje/destino-viaje';
import { DestinosApiClient, ClonDelApi } from '../../models/destinos-api-client.model';
@Component({
  selector: 'app-lista-destinos',
  imports: [CommonModule, FormDestinoViaje, DestinoViaje, AsyncPipe],
  templateUrl: './lista-destinos.html',
  styleUrl: './lista-destinos.css',
})
export class ListaDestinos {
  private api = inject(DestinosApiClient);
  private apiAlias = inject(ClonDelApi) as DestinosApiClient; // Inyectamos el alias
  destinos$: Observable<DestinoViajes[]> = (this.api.getAll());

  update: string[] = [];

  constructor(private store: Store<{ destinos: DestinosViajesState }>) {
    // 1. Nos suscribimos al flujo de datos (ahora asíncrono desde Express)
    this.api.getAll().subscribe((datos: DestinoViajes[]) => {
      // 2. Solo cuando los datos llegan del servidor, los mandamos al Store
      if (datos && datos.length > 0) {
        datos.forEach(d => {
          this.store.dispatch(nuevoDestino({ destino: d }));
        });
      }
    });

    // 3. Vinculamos el observable de la vista al Store
    this.destinos$ = this.store.select(state => state.destinos.items);

    // Suscripción al favorito (se mantiene igual)
    this.store.select(state => state.destinos.favorito)
      .subscribe(d => {
        if (d) {
          this.update.push('Se eligió a ' + d.nombre);
        }
      });
  }

  agregado(d: DestinoViajes) {
    this.store.dispatch(nuevoDestino({ destino: d }));
    this.update.push('Se agregó ' + d.nombre);
  }

  elegido(d: DestinoViajes) {
    this.store.dispatch(elegidoFavorito({ destino: d }));
  }

  eliminarDestino(d: DestinoViajes) {

    // 2. Avisamos al Store para que lo quite de la pantalla
    this.store.dispatch(eliminarDestino({ destino: d }));
    // 1. Primero lo quitamos del LocalStorage a través del API
    this.api.eliminar(d);

    this.update.push('Se eliminó ' + d.nombre);
  }
}