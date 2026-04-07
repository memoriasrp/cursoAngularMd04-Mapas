import { DestinosViajesState, initializeDestinosViajesState } from './destinos.state';
import {
    DestinosViajesActionTypes,
    NuevoDestinoAction,
    ElegidoFavoritoAction,
    EliminarDestinoAction
} from './destinos.actions';
import { Action } from '@ngrx/store';
import { DestinoViajes } from '../../models/destino-viaje.model';

export function reducerDestinosViajes(
    state: DestinosViajesState = initializeDestinosViajesState(),
    action: Action
): DestinosViajesState {
    switch (action.type) {
        case DestinosViajesActionTypes.NUEVO_DESTINO:
            const nuevo = action as NuevoDestinoAction;
            return {
                ...state,
                items: [...state.items, nuevo.destino]
            };
        case DestinosViajesActionTypes.ELEGIDO_FAVORITO:
        const fav = action as ElegidoFavoritoAction;

        return {
            ...state,
            items: state.items.map(x => {
            const nuevo = new DestinoViajes(x.nombre, x.imagenUrl);
            nuevo.setSelected(x === fav.destino);
            return nuevo;
            }),
            favorito: fav.destino
        };
        case DestinosViajesActionTypes.ELIMINAR_DESTINO:
            const eliminar = action as EliminarDestinoAction;
            return {
                ...state,
                items: state.items.filter(x => x !== eliminar.destino),
                favorito: state.favorito === eliminar.destino ? null : state.favorito

            };

        default:
            return state;
    }
}