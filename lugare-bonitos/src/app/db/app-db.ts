import Dexie, { Table } from 'dexie';

export class AppDB extends Dexie {
    // Usamos 'any' para evitar conflictos entre la Clase y los objetos planos de la DB
    destinos!: Table<any, number>;

    constructor() {
        super('DestinosDB');
        this.version(1).stores({
            destinos: 'id, nombre' // 'id' es la clave primaria (sin ++ porque viene del servidor)
        });
    }
}

// Exportamos la instancia lista para usar
export const db = new AppDB();