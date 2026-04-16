// destinos-api-client-storage.ts
import { inject, Injectable } from '@angular/core';
import { DestinosApiClient } from './destinos-api-client.model';
import { DestinoViajes } from './destino-viaje.model';
import { HttpClient } from '@angular/common/http';
import { RESERVAS_API_CONFIG } from '../core/tokens/app-config.token';

import { Observable, of, from, catchError, take } from 'rxjs';
import { map, switchMap, tap, startWith, distinctUntilChanged } from 'rxjs/operators'; // Importación necesaria

import { db } from '../db/app-db'; // Importamos la instancia de Dexie
import { Store } from '@ngrx/store';
import { cargarDestinos, nuevoDestino } from '../store/destinos/destinos.actions';

@Injectable({ providedIn: 'root' })
export class DestinosApiClientLocalStorage extends DestinosApiClient {
    private http = inject(HttpClient);
    private config = inject(RESERVAS_API_CONFIG);
    private store = inject(Store);
    constructor() {
        super(); // Llama al constructor original (inicializa array vacío)
        const db = localStorage.getItem('destinos');
        if (db) {
            // Cargamos lo que había guardado
            const data = JSON.parse(db);
            this.destinos = data.map((d: any) => new DestinoViajes(d.nombre, d.imagenUrl, d.id));
        }
    }

    override getAll(): Observable<DestinoViajes[]> {
        return from(db.destinos.toArray()).pipe(
            take(1),
            switchMap(async (todosLosLocales) => {
                // 1. Buscamos los que no están sincronizados
                const pendientes = todosLosLocales.filter(d => !d.sincronizado);
                if (pendientes.length > 0) {
                    // 2. Los enviamos uno por uno al servidor (Sincronización manual)
                    for (const p of pendientes) {
                        this.intentarSincronizar(p);
                    }
                }
                return todosLosLocales;
            }),
            switchMap(locales => {
                const url = `${this.config.baseUrl}/destinos`;

                // 2. Consultamos al servidor Express
                return this.http.get<any[]>(url).pipe(
                    // 3. Sincronizamos Dexie con lo que llegue del servidor
                    tap(remotos => this.sincronizarDexie(remotos)),
                    // para tener la unión de "Servidor + Local Offline"
                    switchMap(() => from(db.destinos.toArray())),
                    // 4. Mapeo para los datos del Servidor (Online)
                    map((data: any[]) => this.rehidratarDestinos(data)),
                    // 1. Atrapamos el error aquí para que el flujo siga vivo
                    catchError(err => {
                        console.warn('Servidor offline, usando datos de Dexie');
                        // Retornamos un array vacío o el flujo actual para que no explote
                        return of(this.rehidratarDestinos(locales));
                    }),
                    // 2. startWith debe ir DESPUÉS del catchError o map
                    startWith(this.rehidratarDestinos(locales)),
                    // 3. El filtro de cambios va ANTES del dispatch
                    distinctUntilChanged((prev, curr) => JSON.stringify(prev) === JSON.stringify(curr)),
                    // 4. Solo despachamos si los datos son diferentes y válidos
                    tap(destinos => {
                        if (destinos && destinos.length > 0) {
                            this.store.dispatch(cargarDestinos({ destinos }));
                        }
                    })
                );
            })
        );
    }
    override add(d: DestinoViajes) {
        super.add(d);
        const idTemporal = Date.now();
        // 1. Crear el objeto con ID temporal y marca en false
        const objetoParaDexie = {
            id: idTemporal,
            nombre: d.nombre,
            imagenUrl: d.imagenUrl,
            votos: d.votos || 0,
            sincronizado: false
        };

        // 2. Guardamos en Dexie y en el Store inmediatamente (Modo Optimista)
        db.destinos.put(objetoParaDexie).then(() => {
            console.log('Dexie: Guardado local inicial (Offline-ready)');
        });

        this.store.dispatch(nuevoDestino({ destino: objetoParaDexie as any }));

        // 3. Intentamos sincronizar con el servidor
        this.intentarSincronizar(objetoParaDexie);
    }

    private intentarSincronizar(destino: any) {
        const url = `${this.config.baseUrl}/destinos`;

        this.http.post<any>(url, destino).subscribe({
            next: (res) => {
                console.log('Sincronización exitosa con el servidor');

                // Si el servidor responde, actualizamos Dexie:
                // Borramos el temporal y ponemos el oficial con sincronizado = true
                db.destinos.delete(destino.id);
                db.destinos.put({ ...res, sincronizado: true });
                // 2. Actualizamos el Store para quitar el temporal y poner el real
                // Esto evitará que al refrescar la lista por el getAll se vea el salto
                this.store.dispatch(nuevoDestino({ destino: res }));
            },
            error: (err) => {
                console.warn('Servidor Offline. Se queda en Dexie como sincronizado: false');
                // No hacemos nada, ya está guardado en Dexie con false por el paso 2 del add()
            }
        });
    }
    override eliminar(d: DestinoViajes) {
        if (!d.id) return;
        super.eliminar(d);
        // Borramos de Dexie
        db.destinos.delete(d.id);
        const url = `${this.config.baseUrl}/destinos/${d.id}`;
        this.http.delete(url).subscribe({
            next: (res) => console.log('Borrado del servidor:', res),
            error: (err) => console.error('Error al borrar en servidor:', err)
        });
    }

    override actualizarVotos(d: DestinoViajes, votosManuales?: number): void {
        // Prioridad al valor calculado manualmente para evitar desfases
        const votosASincronizar = votosManuales !== undefined ? votosManuales : d.votos;
        const url = `${this.config.baseUrl}/destinos/${d.id}`;

        this.http.patch(url, { votos: votosASincronizar }).subscribe({
            next: (res) => {
                console.log('Confirmado por servidor:', res)
                db.destinos.update(d.id, { votos: votosASincronizar })
                    .then(updated => {
                        if (updated) console.log('Dexie: Votos actualizados localmente');
                    });
            },
            error: (err) => console.error('Error al sincronizar votos:', err)
        });
    }

    private async sincronizarDexie(destinos: any[]) {
        try {
            // Guardamos solo los datos planos (sin métodos)
            const datosPlanos = destinos.map(d => ({
                id: d.id,
                nombre: d.nombre,
                imagenUrl: d.imagenUrl,
                votos: d.votos || 0
            }));
            // bulkPut actualiza si existe el ID o inserta si no. No duplica.
            await db.destinos.bulkPut(datosPlanos);
            console.log('Dexie: Datos sincronizados.');
        } catch (error) {
            console.error('Error sincronizando Dexie:', error);
        }
    }
    private rehidratarDestinos(data: any[]): DestinoViajes[] {
        if (!data) return [];

        return data.map(item => {
            const d = new DestinoViajes(
                item.nombre,
                item.imagenUrl,
                item.id,
                item.votos || 0
            );
            if (item.selected) { d.setSelected(true); }
            return d;
        });
    }
}