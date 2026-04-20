// 1. Importación estática (Vite la entiende perfectamente)
import maplibregl from 'maplibre-gl';
// 2. Definimos la propiedad global antes de cualquier otra lógica
(window as any).mapboxgl = maplibregl;
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';

// NgRx
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { isDevMode } from '@angular/core';



// Tu reducer y effects
import { reducerDestinosViajes } from './app/store/destinos/destinos.reducer';
import { DestinosViajesEffects } from './app/store/destinos/destinos.effects';



bootstrapApplication(App, {
  ...appConfig,
  providers: [
    ...(appConfig.providers ?? []),
    provideRouter(routes),
    // Aquí integras NgRx
    provideStore({
      destinos: reducerDestinosViajes
    }),

    provideEffects([
      DestinosViajesEffects
    ]),
    // NgRx DevTools 
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
    })


  ]
}).catch((err) => console.error(err));