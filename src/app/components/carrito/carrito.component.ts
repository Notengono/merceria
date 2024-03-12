import { Component, OnInit } from '@angular/core';

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

    imprimirCarrito() { }

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
