import { Action } from '@ngrx/store';
import { DestinoViajes } from '../../models/destino-viaje.model';

export enum DestinosViajesActionTypes {
    NUEVO_DESTINO = '[Destinos Viajes] Nuevo',
    ELEGIDO_FAVORITO = '[Destinos Viajes] Favorito',
    ELIMINAR_DESTINO = '[Destinos Viajes] Eliminar'
}

export class NuevoDestinoAction implements Action {
    readonly type = DestinosViajesActionTypes.NUEVO_DESTINO;
    constructor(public destino: DestinoViajes) { }
}

export class ElegidoFavoritoAction implements Action {
    readonly type = DestinosViajesActionTypes.ELEGIDO_FAVORITO;
    constructor(public destino: DestinoViajes) { }
}

export class EliminarDestinoAction implements Action {
  readonly type = DestinosViajesActionTypes.ELIMINAR_DESTINO;
  constructor(public destino: DestinoViajes) {}
}

export type DestinosViajesActions =
    | NuevoDestinoAction
    | ElegidoFavoritoAction
    | EliminarDestinoAction;