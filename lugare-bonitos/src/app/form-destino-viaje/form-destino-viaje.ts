import { Component, Output, EventEmitter } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { DestinoViajes } from '../models/destino-viaje.model';

@Component({
  selector: 'app-form-destino-viaje',
  imports: [ReactiveFormsModule],
  templateUrl: './form-destino-viaje.html',
  styleUrl: './form-destino-viaje.css',
})
export class FormDestinoViaje {
  @Output() onItemAdded = new EventEmitter<DestinoViajes>();
  fg: FormGroup;
  mensajeError = '';
  minLongitud = 5;

  constructor(fb: FormBuilder) {
    this.onItemAdded = new EventEmitter();
    this.fg = fb.group({
      nombre: ['', [Validators.required, this.validarNombre.bind(this)]],
      url: ['', [Validators.required, this.validarUrl.bind(this)]]
    });

    // es un ejemplo que registrar todos los cambios que se realizan en el formulario
    //this.fg.valueChanges.subscribe((form: any) => { console.log('this->' + form) });
  }

  guardar(): boolean {
    if (this.fg.invalid) {
      this.mensajeError = 'Falta completar todos los campos';

      return false;
    }

    const nombre = this.fg.value.nombre!;
    const url = this.fg.value.url!;
    const nuevoDestino = new DestinoViajes(nombre, url + "/380/230");

    // Emitimos al componente padre
    this.onItemAdded.emit(nuevoDestino);

    // Limpiar formulario
    this.fg.reset();

    return false;
  }

  validarNombre(control: FormControl) {
    const valor = control.value;
    if (valor.length < this.minLongitud)
      return { minlength: true };
    return null; // válido
  }
  validarUrl(control: FormControl) {
    const valor = control.value;

    if (!valor) {
      return { required: true };
    }
    const patron = /^https?:\/\/.+/;
    if (!patron.test(valor)) {
      return { pattern: true };
    }

    return null; // válido
  }

}
