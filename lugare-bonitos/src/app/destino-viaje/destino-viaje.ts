import { Component, HostBinding, Input, Output, EventEmitter } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';

import { DestinoViajes } from '../models/destino-viaje.model';
import {
  votarUp,
  votarDown,
  elegidoFavorito,
  eliminarDestino,
  resetVote
} from '../store/destinos/destinos.actions';

@Component({
  selector: 'app-destino-viaje',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './destino-viaje.html',
  styleUrl: './destino-viaje.css',
})
export class DestinoViaje {

  @Input() destino!: DestinoViajes;
  @Input() position!: number;
  @Output() onItemDeleted = new EventEmitter<DestinoViajes>();

  @HostBinding('attr.class') cssClass = 'col-md-4';

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
    this.store.dispatch(votarUp({ destino: this.destino }));
    return false;
  }

  // Votar abajo
  voteDown() {
    this.store.dispatch(votarDown({ destino: this.destino }));
    return false;
  }

  resetVote() {
    this.store.dispatch(resetVote({ destino: this.destino }));
    return false;
  }
}