import { createReducer, on } from '@ngrx/store';
import { nuevoDestino, elegidoFavorito, eliminarDestino, votarUp, votarDown, resetVote, cargarDestinos } from './destinos.actions';
import { DestinoViajes } from '../../models/destino-viaje.model';
import { DestinosViajesState, initializeDestinosViajesState } from './destinos.state';

export const initialState: DestinosViajesState = initializeDestinosViajesState();

export const reducerDestinosViajes = createReducer(
  initialState,

  // NUEVO DESTINO
  // En destinos.reducer.ts
  on(nuevoDestino, (state, { destino }) => {
    // Solo buscamos por nombre para "unificar" el temporal con el real
    const indice = state.items.findIndex(x => x.nombre === destino.nombre);

    if (indice !== -1) {
      // Si ya existe el nombre, pisamos el viejo con el nuevo 
      // (esto cambia el ID temporal por el real sin duplicar)
      const nuevaLista = [...state.items];
      nuevaLista[indice] = destino;
      return { ...state, items: nuevaLista };
    }

    // Si el nombre no existe, es un destino totalmente nuevo
    return { ...state, items: [...state.items, destino] };
  }),
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
    items: state.items.filter(x => x.id !== destino.id), // Comparamos IDs
    favorito: state.favorito?.id === destino.id ? null : state.favorito
  })),

  // VOTAR UP
  on(votarUp, (state, { destino }) => ({
    ...state,
    items: state.items.map(d =>
      d.id === destino.id
        ? new DestinoViajes(
          d.nombre,
          d.imagenUrl,
          d.id,
          (d.votos ?? 0) + 1, // Ahora es el 3er argumento
          d.servicios,        // 4to
          d.selected          // 5to
        )
        : d)
  })),
  // VOTAR DOWN
  on(votarDown, (state, { destino }) => ({
    ...state,
    items: state.items.map(d =>
      d.id === destino.id
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
      d.id === destino.id
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
  // Al final de tu createReducer...
  on(cargarDestinos, (state, { destinos }) => ({
    ...state,
    items: [...destinos] // REEMPLAZA, no acumula. Esto quita el error de duplicados.
  })),
);