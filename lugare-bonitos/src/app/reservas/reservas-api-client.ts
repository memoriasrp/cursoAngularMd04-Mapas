import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Para conectar con el backend
import { Observable, of } from 'rxjs';
import { RESERVAS_API_CONFIG } from '../core/tokens/app-config.token'; // Configuración específica para reservas

@Injectable({
  providedIn: 'root',
})
export class ReservasApiClient {
  // Inyección moderna en Angular 21
  private http = inject(HttpClient);

  // Inyectamos el valor del token usando la función inject()
  private config = inject<any>(RESERVAS_API_CONFIG);

  // Ejemplo: Método para obtener todas las reservas
  getAllReservas(): Observable<any[]> {
    // Usamos los datos del token
    console.log(`Conectando a: ${this.config.baseUrl} con timeout de ${this.config.timeout}ms`);
    // return this.http.get(`${this.config.baseUrl}/listado`);
    return of([
      { id: 1, nombreDestino: 'Paris', fecha: '2024-07-01' },
      { id: 2, nombreDestino: 'New York', fecha: '2024-08-15' },
    ]);
  }
}
