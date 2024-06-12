import { Component, OnInit, ɵclearResolutionOfComponentResourcesQueue } from '@angular/core';
import { PresupuestoService } from 'src/app/services/presupuesto.service';

@Component({
    selector: 'app-inf-presupuesto',
    templateUrl: './inf-presupuesto.component.html',
    styleUrls: ['./inf-presupuesto.component.css']
})
export class InfPresupuestoComponent implements OnInit {

    enviarPresupuesto: string = '';
    mensaje: string = '';
    celular: number = 54343;
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

    cambioCelular() {
        this.enviarPresupuesto = `https://api.whatsapp.com/send?phone=${this.celular}&text=${this.mensaje}`
    }

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
            console.log(respuesta.datos)
            this.listadoMostrarProductos.forEach((element: any) => {
                this.mensaje = this.mensaje + element.descripcion + ' * ' + element.cantidad + ' -> $' + element.precio + '%0A'
            });
            this.enviarPresupuesto = `https://api.whatsapp.com/send?phone=${this.celular}&text=${this.mensaje}`

        })
    }

}
