import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {

  carrito: any[] = [];
  precioTotal = 0
  constructor() { }

  ngOnInit(): void {
    this.carrito = JSON.parse(localStorage.getItem('carrito') || '{}');
    console.clear()
    console.log('Carrito =>', this.carrito)


    for (let item of this.carrito) {
      this.precioTotal += item.precio
    }

  }

}
