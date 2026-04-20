import { Component, OnInit, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import maplibregl from 'maplibre-gl'; // Importación directa y limpia
@Component({
  selector: 'app-mapa',
  standalone: true,
  imports: [],
  templateUrl: './mapa.html',
  styleUrl: './mapa.css',
})
export class Mapa implements AfterViewInit {
  // Obtenemos una referencia al DIV del HTML
  @ViewChild('mapContainer') mapContainer!: ElementRef;

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
  }
}