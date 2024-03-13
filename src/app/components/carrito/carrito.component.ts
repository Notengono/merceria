import { Component, OnInit } from '@angular/core';
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
    constructor() { }

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

        doc.text("Angel Andres", 10, 10);

        let linea = 30
        for (let item of this.carrito) {
            console.log(item.cantidad)
            doc.setFontSize(10);
            doc.text(item.descripcion, 10, linea);
            doc.text('$ ' + item.precioIndividual.toString(), 130, linea);
            doc.text(item.caintidad.toString(), 150, linea);
            doc.text('$ ' + item.precio.toString(), 160, linea);
            linea += 10
        }

        // <td>{{item.descripcion}}</td>
        //             <td>${{item.precioIndividual}}</td>
        //             <td class="text-end">{{item.caintidad}}</td>
        //             <td class="text-center">${{item.precio}}</td>

        doc.output('dataurlnewwindow');
        // doc.save("a4.pdf");
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
}
