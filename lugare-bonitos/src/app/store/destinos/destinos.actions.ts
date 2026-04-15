import { createAction, props } from '@ngrx/store';
import { DestinoViajes } from '../../models/destino-viaje.model';

export const nuevoDestino = createAction(
  '[Destinos Viajes] Nuevo',
  props<{ destino: DestinoViajes }>()
);
export const cargarDestinos = createAction(
  '[Destinos Viajes] Cargar',
  props<{ destinos: DestinoViajes[] }>()
);

export const elegidoFavorito = createAction(
  '[Destinos Viajes] Favorito',
  props<{ destino: DestinoViajes }>()
);

export const eliminarDestino = createAction(
  '[Destinos Viajes] Eliminar',
  props<{ destino: DestinoViajes }>()
);

export const votarUp = createAction(
  '[Destinos Viajes] Votar Up',
  props<{ destino: DestinoViajes }>()
);

export const votarDown = createAction(
  '[Destinos Viajes] Votar Down',
  props<{ destino: DestinoViajes }>()
);

export const resetVote = createAction(
  '[Destinos Viajes] Reset Vote',
  props<{ destino: DestinoViajes }>()
);