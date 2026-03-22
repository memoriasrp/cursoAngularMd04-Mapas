import { Component, EventEmitter, HostBinding, Input, Output } from '@angular/core';
import { DestinoViajes } from '../models/destino-viaje.model';
@Component({
  selector: 'app-destino-viaje',
  standalone: true,
  imports: [],
  templateUrl: './destino-viaje.html',
  styleUrl: './destino-viaje.css',

})
export class DestinoViaje {

  @Input() destino!: DestinoViajes;
  @Input() position!: number;
  @HostBinding('attr.class') cssClass = 'col-md-4'

  @Output() clicked = new EventEmitter<DestinoViajes>();

  ir(): boolean {
    this.clicked.emit(this.destino);
    return false;
  }
}
