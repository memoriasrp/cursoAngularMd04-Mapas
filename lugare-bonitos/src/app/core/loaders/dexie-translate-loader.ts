import { HttpClient } from '@angular/common/http';
import { TranslateLoader } from '@ngx-translate/core';
import { Observable, from, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { db, Translation } from '../../db/app-db'; // Asegúrate de que la ruta a tu db.ts sea correcta

export class DexieTranslateLoader implements TranslateLoader {
    constructor(private http: HttpClient, private url: string) { }
    getTranslation(lang: string): Observable<any> {
        return this.http.get(`${this.url}${lang}`).pipe(
            tap(async (objetoTraducciones: any) => {
                // Convertimos el objeto {hola: 'Holaes'} en filas para Dexie
                for (const [clave, valor] of Object.entries(objetoTraducciones)) {
                    await db.translations.put({
                        lang: lang,
                        key: clave,
                        value: valor as string
                    });
                }
            }),
            catchError(() => {
                // 1. Buscamos todas las filas que coincidan con el idioma (ej: 'es')
                return from(db.translations.where('lang').equals(lang).toArray()).pipe(
                    map((rows: Translation[]) => {
                        // 2. Si no hay nada en la DB, devolvemos un objeto vacío
                        if (!rows || rows.length === 0) return {};

                        // 3. Convertimos el array de filas en el objeto que Angular necesita
                        // De: [{key: 'hola', value: 'Hola'}, {key: 'titulo', value: 'Viajes'}]
                        // A:  { hola: 'Hola', titulo: 'Viajes' }
                        const translationObject: any = {};
                        rows.forEach(row => {
                            translationObject[row.key] = row.value;
                        });

                        return translationObject;
                    })
                );
            })
        );
    }
}