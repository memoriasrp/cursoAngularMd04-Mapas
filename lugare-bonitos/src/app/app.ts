import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { ListaDestinos } from './lista-destinos/lista-destinos';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, ListaDestinos],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('lugare-bonitos');
}
