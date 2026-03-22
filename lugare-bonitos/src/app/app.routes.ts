import { Routes } from '@angular/router';
import { ListaDestinos } from './lista-destinos/lista-destinos';
import { DestinoViaje } from './destino-viaje/destino-viaje';


export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: ListaDestinos },
    { path: 'destino', component: DestinoViaje }
];
