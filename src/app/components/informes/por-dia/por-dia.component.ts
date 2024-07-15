import { Component, OnInit } from '@angular/core';
import { PresupuestoService } from 'src/app/services/presupuesto.service';

@Component({
    selector: 'app-por-dia',
    templateUrl: './por-dia.component.html',
    styleUrls: ['./por-dia.component.css']
})
export class PorDiaComponent implements OnInit {
    fechaBusqueda: string = '';
    listadoMostrar: any = [];
    buscando: boolean = false
    total: number = 0;

    constructor(private _presupuestoService: PresupuestoService) { }

    ngOnInit(): void {
        const aux_ = new Date();
        const aux1_ = ((aux_.getMonth() + 1) > 9) ? (aux_.getMonth() + 1) : '0' + (aux_.getMonth() + 1);
        const aux2_ = ((aux_.getUTCDate() + 1) > 9) ? aux_.getUTCDate() : '0' + aux_.getUTCDate();
        this.fechaBusqueda = aux_.getFullYear() + '-' + aux1_ + '-' + aux2_;
    }

    buscar() {
        console.clear()
        this.buscando = true
        this._presupuestoService.buscarProductos(this.fechaBusqueda).subscribe(respuesta => {
            this.listadoMostrar = respuesta
            this.listadoMostrar.forEach((element: any) => {
                this.total += element.precio
            });
        })
    }
}
