import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import maplibregl from 'maplibre-gl'; // Importación directa y limpia
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { EspiameDirective } from '../../espiame';
@Component({
  selector: 'app-mapa',
  standalone: true,
  imports: [CommonModule, EspiameDirective],
  templateUrl: './mapa.html',
  styleUrl: './mapa.css',
  animations: [
    trigger('aparecerMapa', [
      // :enter es un alias para 'void => *' (de no existir a existir)
      transition(':enter', [
        // Estado inicial: Invisible y 30px abajo
        style({ opacity: 0, transform: 'translateY(30px)' }),
        // Animación final: Duración de 600ms con suavizado
        animate('600ms ease-out', style({ opacity: 12, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('listaAnimada', [
      transition('* <=> *', [ // Cada vez que la lista cambie
        query(':enter', [
          // 1. Estado inicial: Fuera de la pantalla e invisible
          style({ opacity: 0, transform: 'translateX(-50px)' }),

          // 2. Aplicamos el Stagger: 100ms de retraso entre cada elemento
          stagger('900ms', [
            animate('100ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class Mapa implements AfterViewInit {
  // Obtenemos una referencia al DIV del HTML
  @ViewChild('mapContainer') mapContainer!: ElementRef;
  destinos = [{ nombre: 'Cuzco' }, { nombre: 'Arequipa' }, { nombre: 'Lima' }];

  ngAfterViewInit() {
    // Inicializamos el mapa manualmente
    const map = new maplibregl.Map({
      container: this.mapContainer.nativeElement,
      zoom: 2,
      center: [0, 0],
      style: {
        "version": 8,
        "sources": {
          "world": {
            "type": "geojson",
            "data": "https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json"
          },
          "osm": {
            "type": "raster",
            "tiles": ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            "tileSize": 256
          }
        },
        "layers": [
          {
            "id": "capa-osm",
            "type": "raster",
            "source": "osm"
          },
          {
            "id": "paises-relleno",
            "type": "fill",
            "source": "world",
            "paint": {
              "fill-color": "#627BC1",
              "fill-opacity": 0.5,
              "fill-outline-color": "#ffffff"
            }
          }
        ]
      }
    });

    // Añadimos controles de navegación (opcional)
    map.addControl(new maplibregl.NavigationControl());
    map.on('click', (e) => {
      // e.lngLat contiene las coordenadas donde el usuario hizo clic
      const { lng, lat } = e.lngLat;

      // Creamos el Popup
      new maplibregl.Popup({ offset: 25 }) // Desplazamiento para que no tape el cursor
        .setLngLat([lng, lat])
        .setHTML(`
          <div style="padding: 10px;">
            <h3 style="margin: 0; color: #627BC1;">¡Lugar Bonito!</h3>
            <p>Coordenadas:</p>
            <code>Lat: ${lat.toFixed(4)}<br>Lng: ${lng.toFixed(4)}</code>
            <br><br>
            <button class="btn-reserva">Reservar aquí</button>
          </div>
        `)
        .addTo(map); // Lo añadimos al mapa
    });
  }

}