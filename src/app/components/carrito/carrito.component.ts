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

        doc.text("Hello world!", 10, 10);
        doc.save("a4.pdf");
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
