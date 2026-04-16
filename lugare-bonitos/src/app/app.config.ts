import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, InjectionToken, importProvidersFrom } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, HttpClient } from '@angular/common/http';
import { RESERVAS_API_CONFIG } from './core/tokens/app-config.token';
import { routes } from './app.routes';
import { DestinosApiClientLocalStorage } from './models/DestinosApiClientLocalStorage';
import { DestinosApiClient, ClonDelApi } from './models/destinos-api-client.model';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';

import { TRANSLATE_HTTP_LOADER_CONFIG } from '@ngx-translate/http-loader';
import { DexieTranslateLoader } from './core/loaders/dexie-translate-loader';

// Función para cargar los archivos JSON
export function HttpLoaderFactory(http: HttpClient, apiConfig: any) {
  const baseUrl = apiConfig.baseUrl;
  const urlTranslate = `${baseUrl}/translate/?lang=`;

  return new DexieTranslateLoader(http, urlTranslate);
}
export const appConfig: ApplicationConfig = {

  providers: [
    provideHttpClient(),
    // Tip: En v21 se suele incluir provideZoneChangeDetection para mejor rendimiento
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),// 2. Activar el binding mágico
    provideHttpClient(),
    {
      provide: RESERVAS_API_CONFIG,
      useValue: { baseUrl: 'http://localhost:3000/api', timeout: 5000 }
    },
    { provide: TRANSLATE_HTTP_LOADER_CONFIG, useValue: {} },
    {
      provide: DestinosApiClient,        // La base
      useClass: DestinosApiClientLocalStorage // La mejora
    },
    {
      provide: ClonDelApi,       // El nombre nuevo
      useExisting: DestinosApiClient // El puente: usa el que ya existe
    },
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
