import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, HttpClient } from '@angular/common/http';
import { RESERVAS_API_CONFIG } from './core/tokens/app-config.token';
import { routes } from './app.routes';
import { DestinosApiClientLocalStorage } from './models/DestinosApiClientLocalStorage';
import { DestinosApiClient, ClonDelApi } from './models/destinos-api-client.model';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TRANSLATE_HTTP_LOADER_CONFIG } from '@ngx-translate/http-loader';
import { DexieTranslateLoader } from './core/loaders/dexie-translate-loader';
import { InjectionToken } from '@angular/core';
export const MAPBOX_API_KEY = new InjectionToken<string>('mapbox.config.api.key');
// Archivo: src/app/app.config.ts
import { provideAnimations } from '@angular/platform-browser/animations';




// Función para cargar las traducciones usando Dexie
export function HttpLoaderFactory(http: HttpClient, apiConfig: any) {
  // Validación preventiva
  const baseUrl = apiConfig?.baseUrl || 'http://localhost:3000/api';
  const urlTranslate = `${baseUrl}/translate/?lang=`;
  return new DexieTranslateLoader(http, urlTranslate);
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(), // Uno solo es suficiente
    provideRouter(routes, withComponentInputBinding()),
    provideAnimations(),
    // Configuración de la API
    {
      provide: RESERVAS_API_CONFIG,
      useValue: { baseUrl: 'http://localhost:3000/api', timeout: 5000 }
    },

    // Inyección de Servicios
    {
      provide: DestinosApiClient,
      useClass: DestinosApiClientLocalStorage
    },
    {
      provide: ClonDelApi,
      useExisting: DestinosApiClient
    },

    // Configuración para MapLibre (vía ngx-mapbox-gl)
    {
      provide: MAPBOX_API_KEY,
      useValue: '' // MapLibre no lo requiere
    },

    // Configuración de Traducción
    { provide: TRANSLATE_HTTP_LOADER_CONFIG, useValue: {} },
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient, RESERVAS_API_CONFIG]
        }
      })
    )
  ]
};