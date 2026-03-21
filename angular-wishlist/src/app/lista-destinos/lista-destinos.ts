import { Component } from '@angular/core';
import { Destinoviaje } from '../destinoviaje/destinoviaje';

import { NgFor } from '@angular/common';
@Component({
  selector: 'app-lista-destinos',
  standalone: true,

  imports: [NgFor, Destinoviaje],
  templateUrl: './lista-destinos.html',
  styleUrl: './lista-destinos.css',
})
export class ListaDestinos {
  destinos: string[];
  constructor() {
    this.destinos = ['aqui', 'alla', 'mas alla'];
  }
}
