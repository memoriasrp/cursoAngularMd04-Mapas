export class DestinoViajes {

  constructor(
    public nombre: string,
    public imagenUrl: string,
    public id: number,
    public votos: number = 0, // 5º lugar, opcional porque al crear un nuevo destino no lo tenemos aún
    public servicios: string[] = ['pileta', 'desayuno'], // 4º lugar
    public selected: boolean = false
  ) { }

  isSelected(): boolean {
    return this.selected;
  }

  setSelected(v: boolean) {
    this.selected = v;
  }


}