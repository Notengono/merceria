import { Component, OnInit, ɵclearResolutionOfComponentResourcesQueue } from '@angular/core';
import { PresupuestoService } from 'src/app/services/presupuesto.service';

@Component({
    selector: 'app-inf-presupuesto',
    templateUrl: './inf-presupuesto.component.html',
    styleUrls: ['./inf-presupuesto.component.css']
})
export class InfPresupuestoComponent implements OnInit {

    diasBusqueda: number = 7;
    listadoMostrar: any = [];
    buscando: boolean = false

    constructor(private _presupuestoService: PresupuestoService) { }

    ngOnInit(): void { }

    buscar() {
        console.clear()
        this.buscando = true
        this._presupuestoService.buscarPresupuestos(this.diasBusqueda).subscribe(respuesta => {
            this.listadoMostrar = respuesta
        })

    }

}
