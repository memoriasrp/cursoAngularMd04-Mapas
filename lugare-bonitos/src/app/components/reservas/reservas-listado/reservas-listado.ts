import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Para el DatePipe
import { ReservasApiClient } from '../../../reservas/reservas-api-client';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-reservas-listado',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './reservas-listado.html',
  styleUrl: './reservas-listado.css',
})
export class ReservasListado implements OnInit {
  private api = inject(ReservasApiClient);
  misReservas: any[] = [];

  ngOnInit(): void {
    // 3. Llamamos al servicio al iniciar el componente
    this.api.getAllReservas().subscribe({
      next: (data: any) => {
        this.misReservas = data;
      },
      error: (err) => console.error('Error al traer reservas', err)
    });
  }
}
