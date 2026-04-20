import { Component, HostBinding, Input, Output, EventEmitter, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';

import { DestinoViajes } from '../../models/destino-viaje.model';

import { DestinosApiClient } from '../../models/destinos-api-client.model';
import { TrackearClick } from '../../trackear-click';
import { trigger, transition, style, animate, query, stagger, state } from '@angular/animations';
import {
  votarUp,
  votarDown,
  elegidoFavorito,
  eliminarDestino,
  resetVote
} from '../../store/destinos/destinos.actions';

@Component({
  selector: 'app-destino-viaje',
  standalone: true,
  imports: [RouterLink, TrackearClick],
  templateUrl: './destino-viaje.html',
  styleUrl: './destino-viaje.css',
  animations: [
    trigger('esFavorito', [
      state('estadoFavorito', style({
        backgroundColor: 'PaleTurquoise',
      })),
      state('estadoNoFavorito', style({
        backgroundColor: 'whiteSmoke',
      })),
      transition('estadoNoFavorito => estadoFavorito', [
        animate('3s')
      ]),
      transition('estadoFavorito => estadoNoFavorito', [
        animate('1s')
      ])
    ])
  ]
})
export class DestinoViaje {

  @Input() destino!: DestinoViajes;
  @Input() position!: number;
  @Output() onItemDeleted = new EventEmitter<DestinoViajes>();

  @HostBinding('attr.class') cssClass = 'col-md-4';
  private api = inject(DestinosApiClient);
  constructor(private store: Store) { }

  //  Marcar como favorito
  ir() {
    this.store.dispatch(elegidoFavorito({ destino: this.destino }));
  }

  // Eliminar destino
  eliminar() {
    this.store.dispatch(eliminarDestino({ destino: this.destino }));
    this.onItemDeleted.emit(this.destino);
  }

  // Votar arriba
  voteUp() {
    // 1. Calculamos el valor futuro
    const valorNuevo = this.destino.votos + 1;

    // 2. Actualizamos la UI (NgRx)
    this.store.dispatch(votarUp({ destino: this.destino }));

    // 3. Enviamos el valor exacto al servidor
    this.api.actualizarVotos(this.destino, valorNuevo);

    return false;
  }

  // Votar abajo
  voteDown() {
    // Evitamos votos negativos
    const valorNuevo = Math.max(0, this.destino.votos - 1);

    this.store.dispatch(votarDown({ destino: this.destino }));
    this.api.actualizarVotos(this.destino, valorNuevo);

    return false;
  }

  resetVote() {
    this.store.dispatch(resetVote({ destino: this.destino }));
    this.api.actualizarVotos(this.destino, 0);
    return false;
  }
}