import { BehaviorSubject, Subject, Observable, of } from "rxjs";
import { DestinoViajes } from "./destino-viaje.model";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class DestinosApiClient {
    destinos: DestinoViajes[] = [];
    current: BehaviorSubject<DestinoViajes | null> = new BehaviorSubject<DestinoViajes | null>(null);
    constructor() {

    }

    add(d: DestinoViajes) {
        this.destinos.push(d);
    }

    getAll(): Observable<DestinoViajes[]> {
        return of(this.destinos); // 'of' envuelve el array en un Observable
    }

    getById(id: string): DestinoViajes {
        return this.destinos.filter(function (d) { return d.isSelected.toString() === id })[0];
    }

    elegir(d: DestinoViajes) {
        this.destinos = this.destinos.map(x => {
            const nuevo = new DestinoViajes(x.nombre, x.imagenUrl, x.id);
            nuevo.setSelected(x === d);
            return nuevo;
        });

    }

    eliminar(d: DestinoViajes) {
    }

    subscribeOnChange(fn: any) {
        this.current.subscribe(fn);
    }

    // 1. Declaramos el método aquí para que sea visible en toda la app
    actualizarVotos(d: DestinoViajes, votosManuales?: number): void {
        // Se deja vacío o con un log básico
    }

}
export abstract class ClonDelApi { }