import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, NgModel } from '@angular/forms';
import { jsPDF } from "jspdf";
import { PresupuestoService } from 'src/app/services/presupuesto.service';

@Component({
    selector: 'app-carrito',
    templateUrl: './carrito.component.html',
    styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {
    fecha = ''
    estado = 3

    carrito: any[] = [];
    precioTotal = 0
    enCarrito = 0
    precioForm = this.fb.group({
        codigo: 10002,
        grupo: 17,
        subgrupo: 10002,
        producto: 'Varios',
        idproducto: 41,
        precio: 0,
        cantidad: 1,
    })

    modalDescuento = false
    precioTotalD = 0
    descuento = 0
    cantidad = 1
    precio = 0
    precioTotalModal = 0

    constructor(private fb: FormBuilder, private _presupuestoService: PresupuestoService) { }

    ngOnInit(): void {
        const aux_ = new Date();
        const aux1_ = ((aux_.getMonth() + 1) > 9) ? (aux_.getMonth() + 1) : '0' + (aux_.getMonth() + 1);
        const aux2_ = ((aux_.getUTCDate() + 1) > 9) ? aux_.getUTCDate() : '0' + aux_.getUTCDate();
        this.fecha = aux_.getFullYear() + '-' + aux1_ + '-' + aux2_;

        this.carrito = JSON.parse(localStorage.getItem('carrito') || '[{}]');
        this.contarCarrito()
    }

    contarCarrito() {
        this.precioTotal = 0
        this.enCarrito = Array.isArray(this.carrito) ? this.carrito.length : 0
        if (this.enCarrito > 0) {
            for (let item of this.carrito) {
                this.precioTotal += parseFloat(item.precio)
            }
            this.precioTotal = this.precioTotal * (1 - (this.descuento / 100))
        }
    }

    finCarrito() {
        this._presupuestoService
            .postProductos({ fecha: this.fecha, numero: 1, estado: this.estado, fechaFin: this.fecha, productos: this.carrito })
            .subscribe(respuesta => console.log(respuesta))
    }

    imprimirCarrito() {
        // Default export is a4 paper, portrait, using millimeters for units
        const doc = new jsPDF();

        doc.text("Angel Andrés", 20, 20);

        doc.setLineWidth(0.5);
        doc.line(30, 45, 30, 245, 'D')
        doc.line(145, 45, 145, 245, 'D')
        doc.line(167, 45, 167, 245, 'D')
        doc.line(15, 235, 195, 235, 'D')
        doc.rect(15, 45, 180, 200, 'D')
        doc.rect(15, 10, 180, 35, 'D')
        doc.rect(100, 10, 10, 10, 'D')
        doc.line(105, 20, 105, 45, 'D')
        let linea = 50
        for (let item of this.carrito) {
            doc.setFontSize(20);
            doc.text('X', 103, 17);
            doc.setFontSize(10);
            doc.text('0001-000000001', 160, 20);
            doc.text(item.descripcion, 31, linea);
            doc.text('$ ' + item.precioIndividual.toString(), 146, linea);
            doc.text(item.caintidad.toString(), 21, linea);
            doc.text('$ ' + item.precio.toString(), 168, linea);
            linea += 5
        }
        doc.text('$ ' + this.precioTotal.toString(), 168, 241)
        doc.output('dataurlnewwindow');
    }

    quitarItem(indice: any) {
        this.carrito.splice(indice, 1)
        this.contarCarrito()
    }

    cancelarCompra() {
        localStorage.removeItem('carrito')
        this.carrito = []
        this.precioTotal = 0
        this.enCarrito = 0
    }

    modal(valor: string) {
        this.modalDescuento = valor == 'p' ? false : true
    }

    agregarProducto() {
        this.carrito.push({ id: 17, 'descripcion': "Varios", 'precio': this.precioTotalModal, 'precioIndividual': this.precio, 'caintidad': this.cantidad });
        localStorage.setItem('carrito', JSON.stringify(this.carrito))
        this.contarCarrito()
    }

    controlarKeyUp(op: string) {
        switch (op) {
            case 'pi':
                this.precioTotalModal = parseFloat((this.precio * this.cantidad).toFixed(2))
                break;
            case 'pt':
                this.precio = parseFloat((this.precioTotalModal / this.cantidad).toFixed(2))
                break;
            case 'de':
                this.precioTotalD = parseFloat((this.precioTotal * (1 - this.descuento / 100)).toFixed(2))
                break;
            default:
                this.precioTotalModal = parseFloat((this.precio * this.cantidad).toFixed(2))
                break;
        }
    }
}
