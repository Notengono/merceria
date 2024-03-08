import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.component.html',
  styleUrls: ['./carrito.component.css']
})
export class CarritoComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    // console.log(JSON.parse(localStorage.getItem('listado') || '{}'));


    console.clear()
    let keys = Object.keys(localStorage);

    // const cabecera = keys.includes('listad');
    // console.log('=> ', cabecera)

    for (let key of keys) {
      // console.log(key)





      if (key.includes('listad')){
        console.log(key)
      }
      // const { caintidad, descripcion, id, precio, precioIndividual } = JSON.parse(localStorage.getItem('listado') || '{}')
      const listado = JSON.parse(localStorage.getItem('listado') || '{}')

    }

    // console.log(caintidad, descripcion, id, precio, precioIndividual)
  }

}
