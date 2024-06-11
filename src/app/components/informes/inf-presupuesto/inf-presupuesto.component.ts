import { Component, OnInit, ɵclearResolutionOfComponentResourcesQueue } from '@angular/core';
import { PresupuestoService } from 'src/app/services/presupuesto.service';

@Component({
    selector: 'app-inf-presupuesto',
    templateUrl: './inf-presupuesto.component.html',
    styleUrls: ['./inf-presupuesto.component.css']
})
export class InfPresupuestoComponent implements OnInit {

    enviarPresupuesto: string = '';
    diasBusqueda: number = 7;
    listadoMostrar: any = [];
    listadoMostrarProductos: any = [];
    buscando: boolean = false

    constructor(private _presupuestoService: PresupuestoService) { }

    ngOnInit(): void { }

    // ver(id: number) {
    //     this.listadoMostrarProductos = []
    //     this._presupuestoService.buscarPresupuestoDetalle(id).subscribe(respuesta => {
    //         this.listadoMostrarProductos = respuesta.datos
    //     })
    // }

    buscar() {
        console.clear()
        this.buscando = true
        this._presupuestoService.buscarPresupuestos(this.diasBusqueda).subscribe(respuesta => {
            this.listadoMostrar = respuesta.datos
            console.log(this.listadoMostrar)
        })

    }

    ver(id: number) {
        console.clear()
        this.listadoMostrarProductos = []
        this._presupuestoService.buscarPresupuestoDetalle(id).subscribe(respuesta => {
            this.listadoMostrarProductos = respuesta.datos
            let mensaje = ''
            this.listadoMostrarProductos.forEach((element: any) => {
                mensaje = mensaje + element.descripcion + ' * ' + element.cantidad + ' -> $' + element.precio + '%0A'
            });
            this.enviarPresupuesto = `https://api.whatsapp.com/send?phone=543434156030&text=${mensaje}`

        })
    }

}
