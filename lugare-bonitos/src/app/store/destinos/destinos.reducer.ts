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

  // ELEGIDO FAVORITO (Corregido para no perder votos)
  on(elegidoFavorito, (state, { destino }) => ({
    ...state,
    items: state.items.map(x => {
      // IMPORTANTE: Pasamos los votos actuales para no resetearlos a 0
      const nuevo = new DestinoViajes(x.nombre, x.imagenUrl, x.id, x.votos);
      nuevo.setSelected(x.nombre === destino.nombre);
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
          d.id,
          (d.votos ?? 0) + 1, // Ahora es el 3er argumento
          d.servicios,        // 4to
          d.selected          // 5to
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
          d.id,
          Math.max((d.votos ?? 0) - 1, 0),
          d.servicios,
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
          d.id,
          0,
          d.servicios,
          d.selected
        )
        : d
    )
  })),

);