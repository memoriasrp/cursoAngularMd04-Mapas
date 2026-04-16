import { HttpClient } from '@angular/common/http';
import Dexie, { Table } from 'dexie';
import { flatMap, from, Observable } from 'rxjs';
import { inject } from '@angular/core';
import { RESERVAS_API_CONFIG } from '../core/tokens/app-config.token';
import { tap, switchMap, map, catchError } from 'rxjs/operators';
export interface Translation {
    id?: number;
    lang: string;
    key: string;
    value: string;
}
export class AppDB extends Dexie {
    // Usamos 'any' para evitar conflictos entre la Clase y los objetos planos de la DB
    destinos!: Table<any, number>;
    translations!: Table<Translation, number>;
    constructor() {
        super('DestinosDB');
        this.version(1).stores({
            destinos: 'id, nombre' // 'id' es la clave primaria (sin ++ porque viene del servidor)
        });
        this.version(2).stores({
            destinos: 'id, nombre',
            translations: '++id, lang, key, value' // Nueva tabla para traducciones   
        });
    }
}

// Exportamos la instancia lista para usar
export const db = new AppDB();
