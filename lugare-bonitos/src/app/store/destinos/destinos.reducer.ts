import { createReducer, on } from '@ngrx/store';
import { nuevoDestino, elegidoFavorito, eliminarDestino, votarUp, votarDown, resetVote } from './destinos.actions';
import { DestinoViajes } from '../../models/destino-viaje.model';
import { DestinosViajesState, initializeDestinosViajesState } from './destinos.state';

export const initialState: DestinosViajesState = initializeDestinosViajesState();

export const reducerDestinosViajes = createReducer(
  initialState,

  // NUEVO DESTINO
  on(nuevoDestino, (state, { destino }) => ({
    ...state,
    items: [...state.items, destino]
  })),

  // ELEGIDO FAVORITO
  on(elegidoFavorito, (state, { destino }) => ({
    ...state,
    items: state.items.map(x => {
      const nuevo = new DestinoViajes(x.nombre, x.imagenUrl);
      nuevo.setSelected(x === destino);
      nuevo.votos = x.votos ?? 0;
      return nuevo;
    }),
    favorito: destino
  })),

  // ELIMINAR DESTINO
  on(eliminarDestino, (state, { destino }) => ({
    ...state,
    items: state.items.filter(x => x !== destino),
    favorito: state.favorito === destino ? null : state.favorito
  })),

  // VOTAR UP
  on(votarUp, (state, { destino }) => ({
    ...state,
    items: state.items.map(d =>
      d.nombre === destino.nombre
        ? new DestinoViajes(
          d.nombre,
          d.imagenUrl,
          d.servicios,
          (d.votos ?? 0) + 1,
          d.selected
        )
        : d
    )
  })),

  // VOTAR DOWN
  on(votarDown, (state, { destino }) => ({
    ...state,
    items: state.items.map(d =>
      d.nombre === destino.nombre
        ? new DestinoViajes(
          d.nombre,
          d.imagenUrl,
          d.servicios,
          Math.max((d.votos ?? 0) - 1, 0),
          d.selected
        )
        : d
    )
  })),

  on(resetVote, (state, { destino }) => ({
    ...state,
    items: state.items.map(d =>
      d.nombre === destino.nombre
        ? new DestinoViajes(
          d.nombre,
          d.imagenUrl,
          d.servicios,
          0,
          d.selected
        )
        : d
    )
  })),

);