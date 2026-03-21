import { Component, Input } from '@angular/core';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-destinoviaje',
  standalone: true,

  imports: [NgFor],
  templateUrl: './destinoviaje.html',
  styleUrl: './destinoviaje.css',
})
export class Destinoviaje {
  @Input() nombre!: string;
  constructor() {

  }

  ngOnInit() {
    console.log('Hola');
  }

}
