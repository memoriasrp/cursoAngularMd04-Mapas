import { Routes } from '@angular/router';
import { ListaDestinos } from './components/lista-destinos/lista-destinos';
import { DestinoDetalle } from './components/destino-detalle/destino-detalle';
import { Login } from './components/login/login/login';
import { VuelosComponent } from './components/vuelos/vuelos-component/vuelos-component';
import { VuelosDetallesComponent } from './components/vuelos/vuelos-detalles-component/vuelos-detalles-component';
import { VuelosMainComponent } from './components/vuelos/vuelos-main-component/vuelos-main-component';
import { VuelosMasInfoComponent } from './components/vuelos/vuelos-mas-info-component/vuelos-mas-info-component';
import { ReservasListado } from './components/reservas/reservas-listado/reservas-listado';
import { ReservasDetalle } from './components/reservas/reservas-detalle/reservas-detalle';
import { Mapa } from './components/mapa/mapa';
import { usuarioLogueadoGuard } from './guards/usuario-logueado/usuario-logueado-guard';

export const routes: Routes = [
    // Ruta por defecto: redirige al login si no hay nada
    { path: '', redirectTo: 'login', pathMatch: 'full' },

    // Ruta de Login (pública)
    { path: 'login', component: Login },

    // Ruta de Home (pública o protegida, según decidas)
    { path: 'home', component: ListaDestinos, canActivate: [usuarioLogueadoGuard] },

    // Ruta Protegida: Solo entran si el Guard devuelve true
    { path: 'destino', component: DestinoDetalle, canActivate: [usuarioLogueadoGuard] },
    { path: 'mapa', component: Mapa, canActivate: [usuarioLogueadoGuard] },
    // Nueva ruta con hijos
    {
        path: 'vuelos',
        component: VuelosComponent, // Este componente necesita un <router-outlet>
        canActivate: [usuarioLogueadoGuard],
        children: [
            { path: '', redirectTo: 'main', pathMatch: 'full' }, // Ruta por defecto para /vuelos
            { path: 'main', component: VuelosMainComponent },
            { path: 'mas-info', component: VuelosMasInfoComponent },
            { path: 'id/:id', component: VuelosDetallesComponent },
        ]
    },
    {
        path: 'reservas',
        canActivate: [usuarioLogueadoGuard],
        children: [
            { path: '', component: ReservasListado },
            { path: ':id', component: ReservasDetalle }
        ]
    }

];
