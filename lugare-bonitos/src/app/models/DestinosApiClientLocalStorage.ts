// destinos-api-client-storage.ts
import { inject, Injectable } from '@angular/core';
import { DestinosApiClient } from './destinos-api-client.model';
import { DestinoViajes } from './destino-viaje.model';
import { HttpClient } from '@angular/common/http';
import { RESERVAS_API_CONFIG } from '../core/tokens/app-config.token';

import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators'; // Importación necesaria

@Injectable({ providedIn: 'root' })
export class DestinosApiClientLocalStorage extends DestinosApiClient {
    private http = inject(HttpClient);
    private config = inject(RESERVAS_API_CONFIG);
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
        return this.http.get<any[]>(`${this.config.baseUrl}/destinos`).pipe(
            map((data: any[]) => {
                console.log('Datos brutos del servidor:', data);

                return data.map(item => {
                    // "Rehidratación": Creamos una instancia real para cada fila del JSON
                    const d = new DestinoViajes(
                        item.nombre,
                        item.imagenUrl,
                        item.id,
                        item.votos || 0,

                    );
                    if (item.selected) { d.setSelected(true); }

                    return d;
                });
            }));
    }
    override add(d: DestinoViajes) {
        super.add(d); // Ejecuta la lógica original (push al array)
        // Añade lógica nueva: Guardar en LocalStorage
        //localStorage.setItem('destinos', JSON.stringify(this.destinos));

        // 2. Lógica remota: Enviamos el JSON a Express
        const url = `${this.config.baseUrl}/destinos`;
        this.http.post(url, d).subscribe({
            next: (res) => console.log('Guardado en servidor:', res),
            error: (err) => console.error('Error al guardar:', err)
        });

        // 3. Mantener LocalStorage (como respaldo si quieres)
        localStorage.setItem('destinos', JSON.stringify(this.destinos));
    }
    // En tu clase que extiende (la que tiene el LocalStorage)
    // destinos-api-client-storage.ts

    override eliminar(d: DestinoViajes) {
        super.eliminar(d);
        localStorage.setItem('destinos', JSON.stringify(this.destinos));
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
            next: (res) => console.log('Confirmado por servidor:', res),
            error: (err) => console.error('Error al sincronizar votos:', err)
        });
    }
}