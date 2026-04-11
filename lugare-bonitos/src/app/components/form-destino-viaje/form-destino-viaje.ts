import { Component, Output, EventEmitter, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { DestinoViajes } from '../../models/destino-viaje.model';
import { debounceTime, distinctUntilChanged, fromEvent, map, switchMap, filter } from 'rxjs';
import { ajax, AjaxResponse } from 'rxjs/ajax';
import { DestinosApiClient } from '../../models/destinos-api-client.model';
import { RESERVAS_API_CONFIG } from '../../core/tokens/app-config.token';
@Component({
  selector: 'app-form-destino-viaje',
  imports: [ReactiveFormsModule],
  templateUrl: './form-destino-viaje.html',
  styleUrl: './form-destino-viaje.css',
})
export class FormDestinoViaje {
  // Inyectamos la configuración que definiste en appConfig
  private config = inject(RESERVAS_API_CONFIG);
  // 1. Inicializas el EventEmitter aquí mismo
  @Output() onItemAdded = new EventEmitter<DestinoViajes>();

  private fb = inject(FormBuilder);
  private api = inject(DestinosApiClient); // Inyección moderna
  fg: FormGroup = this.fb.group({
    nombre: ['', [Validators.required, this.validarNombre.bind(this)]],
    url: ['', [Validators.required, this.validarUrl.bind(this)]]
  });
  mensajeError = '';
  minLongitud = 3;
  searchResults: string[] = [];

  ngOnInit() {
    this.fg.get('nombre')!.valueChanges
      .pipe(
        map(value => (value ?? '').trim()),
        filter(text => text.length >= this.minLongitud),
        debounceTime(300),
        distinctUntilChanged(),
        // 1. Cambiamos la URL a la de tu servidor Express
        // 2. Usamos la ruta que configuraste: /api/paises
        switchMap((text) => {
          // Usamos la URL del config de forma dinámica
          const url = `${this.config.baseUrl}/paises`;
          return ajax<string[]>(url).pipe(
            map(res => res.response.filter(item =>
              item.toLowerCase().includes(text.toLowerCase())
            ))
          );
        })
      )
      .subscribe(res => {
        this.searchResults = res;
        console.log('Resultados desde el servidor:', res);
      });
  }
  guardar(): boolean {
    if (this.fg.invalid) {
      this.mensajeError = 'Falta completar todos los campos';
      return false;
    }
    const { nombre, url } = this.fg.value;
    const nuevoDestino = new DestinoViajes(nombre, url + "/380/230", 0);
    // 1. Guardamos en el servicio (que puede estar usando useClass para LocalStorage)
    this.api.add(nuevoDestino);

    // 2. Avisamos al padre (opcional si el padre ya escucha al servicio)
    this.onItemAdded.emit(nuevoDestino);

    // Limpiar formulario
    this.fg.reset();

    return false;
  }

  validarNombre(control: FormControl) {
    const valor = control.value ?? ''; // si es null, lo convierte en ''

    if (!valor.trim()) {
      return { required: true };
    }

    if (valor.trim().length < 5) {
      return { minlength: true };
    }

    return null;

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
