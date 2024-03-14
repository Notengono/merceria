import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, NgModel } from '@angular/forms';
import { jsPDF } from "jspdf";

@Component({
    selector: 'app-carrito',
    templateUrl: './carrito.component.html',
    styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {

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

    cantidad = 1
    precio = 0
    precioTotalModal = 0

    constructor(private fb: FormBuilder,) { }

    ngOnInit(): void {
        this.carrito = JSON.parse(localStorage.getItem('carrito') || '{}');
        this.contarCarrito()
    }

    contarCarrito() {
        this.precioTotal = 0
        this.enCarrito = Array.isArray(this.carrito) ? this.carrito.length : 0

        if (this.enCarrito > 0) {
            for (let item of this.carrito) {
                this.precioTotal += parseFloat(item.precio.toFixed(2))
            }
        }
    }

    imprimirCarrito() {
        // Default export is a4 paper, portrait, using millimeters for units
        const doc = new jsPDF();

        doc.text("Presupuesto", 10, 10);

        doc.line(30, 25, 30, 225, 'D')
        doc.line(145, 25, 145, 225, 'D')
        doc.line(167, 25, 167, 225, 'D')
        doc.line(15, 215, 195, 215, 'D')
        doc.rect(15, 25, 180, 200, 'D')
        let linea = 30
        for (let item of this.carrito) {
            console.log(item.cantidad)
            doc.setFontSize(10);
            doc.text(item.descripcion, 31, linea);
            doc.text('$ ' + item.precioIndividual.toString(), 146, linea);
            doc.text(item.caintidad.toString(), 21, linea);
            doc.text('$ ' + item.precio.toString(), 168, linea);
            linea += 5
        }
        doc.text('$ ' + this.precioTotal.toString(), 168, 221)
        doc.output('dataurlnewwindow');
    }

    quitarItem(indice: any) {
        console.log(indice)
        this.carrito.splice(indice, 1)
        this.contarCarrito()
    }

    cancelarCompra() {
        localStorage.removeItem('carrito')
        this.carrito = []
        this.precioTotal = 0
        this.enCarrito = 0
    }

    agregarProducto() {
        console.clear()
        console.log(this.carrito)
        this.carrito.push({
            'caintidad': this.cantidad, 'descripcion': "Varios", id: 17, 'precio': this.precioTotalModal, 'precioIndividual': this.precio
        });
        localStorage.setItem('carrito', JSON.stringify(this.carrito))
        this.contarCarrito()
        console.log(this.carrito)
    }

    controlarKeyUp(op: string) {
        switch (op) {
            case 'pi':
                this.precioTotalModal = parseFloat((this.precio * this.cantidad).toFixed(2))
                break;
            case 'pt':
                this.precio = parseFloat((this.precioTotalModal / this.cantidad).toFixed(2))
                break;
            default:
                this.precioTotalModal = parseFloat((this.precio * this.cantidad).toFixed(2))
                break;
        }
    }
}
