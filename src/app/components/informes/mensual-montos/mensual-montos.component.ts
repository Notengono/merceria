import { Component, OnInit } from '@angular/core';
import { PresupuestoService } from 'src/app/services/presupuesto.service';

@Component({
  selector: 'app-mensual-montos',
  templateUrl: './mensual-montos.component.html',
  styleUrls: ['./mensual-montos.component.css']
})
export class MensualMontosComponent implements OnInit {

  mes: number = 1;
  anio: number = 2024;
  listadoMostrar: any = [];
  buscando: boolean = false
  total: number = 0;

  constructor(private _presupuestoService: PresupuestoService) { }

  ngOnInit(): void {
    const aux_ = new Date();
    this.mes = <number>aux_.getMonth() + 1;
    this.anio = aux_.getFullYear();
  }

  buscar() {
    console.clear()
    this.buscando = true
    this.total = 0
    this._presupuestoService.buscarInfMensualMonto({ anio: this.anio, mes: this.mes }).subscribe(respuesta => {
      this.listadoMostrar = respuesta
      this.listadoMostrar.forEach((element: any) => {
        this.total += element.precio
      });
    })
  }
}
