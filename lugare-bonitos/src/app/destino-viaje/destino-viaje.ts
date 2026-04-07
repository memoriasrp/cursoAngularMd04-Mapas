import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { DestinoViajes } from '../models/destino-viaje.model';
import { RouterLink } from '@angular/router';
@Component({
  selector: 'app-destino-viaje',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './destino-viaje.html',
  styleUrl: './destino-viaje.css',

})
export class DestinoViaje {

  @Input() destino!: DestinoViajes;
  @Input() position!: number;
  @Output() onEliminar = new EventEmitter<DestinoViajes>();

  @HostBinding('attr.class') cssClass = 'col-md-4'

  @Output() clicked = new EventEmitter<DestinoViajes>();

  ir() {
    this.clicked.emit(this.destino);
  }
  eliminar() {
    this.onEliminar.emit(this.destino);
  }

}
