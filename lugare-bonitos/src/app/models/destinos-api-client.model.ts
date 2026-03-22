import { BehaviorSubject, Subject } from "rxjs";
import { DestinoViajes } from "./destino-viaje.model";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})

export class DestinosApiClient {
    destinos: DestinoViajes[];
    current: BehaviorSubject<DestinoViajes | null> = new BehaviorSubject<DestinoViajes | null>(null);
    constructor() {
        this.destinos = [];
    }

    add(d: DestinoViajes) {
        this.destinos.push(d);
    }

    getAll(): DestinoViajes[] {
        return this.destinos;
    }

    getById(id: string): DestinoViajes {
        return this.destinos.filter(function (d) { return d.isSelected.toString() === id })[0];
    }

    elegir(d: DestinoViajes) {
        this.destinos.forEach(x => x.setSelected(false));
        d.setSelected(true);
        this.current.next(d);
    }

    subscribeOnChange(fn: any) {
        this.current.subscribe(fn);
    }

}