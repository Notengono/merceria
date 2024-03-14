import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { ProductosDetalleI } from 'src/app/model/productos-detalle';
import { ProductosService } from 'src/app/services/productos.service';

@Component({
    selector: 'app-buscar-producto',
    templateUrl: './buscar-producto.component.html',
    styleUrls: ['./buscar-producto.component.css'],
})

export class BuscarProductoComponent implements OnInit {
    myControl = new FormControl('');
    filteredoptions: Observable<string[]> | undefined;

    listadoProductos: string[] = []
    listadoProductosTodos: any[] = []
    listadoMostrar: any[] = []
    busquedaForm = this.fb.group({
        inputGroupCategoria: 0,
        inputGroupSubCategoria: 0
    })

    productoModal: string = ''
    idProductoModal: number = 0;
    cantidad: number = 1;
    precioModal: number = 0;
    precio: number = 0;

    cartItems: any[] = [];


    products: any[] = [];
    // { id: 1, name: 'Product 1', price: 10 },
    // { id: 2, name: 'Product 2', price: 20 },
    // { id: this.idProductoModal, descripcion: this.productoModal, precio: parseFloat(this.precioModal.toString()).toFixed(2), precioIndividual: this.precio, caintidad: this.cantidad }



    addToCart(product: any) {
        // this.cartItems.push(product);
        // this.cartItems.push(this.products);
        console.log(this.cartItems)
    }

    constructor(private _productos: ProductosService, private fb: FormBuilder) { }


    // addToCart(product: any) {
    //     console.log(product, typeof (product))

    //     this.cartItems.push(product)
    // }




    ngOnInit() {
        this.listadoProductos = []
        this.cartItems = JSON.parse(localStorage.getItem('carrito') || '[]');
        this._productos.postProductos(this.busquedaForm.value).subscribe(respuesta => {
            this.listadoProductosTodos = (respuesta['resultado'])
            Object.values(respuesta['resultado']).forEach(element => {
                this.listadoProductos.push((element as ProductosDetalleI).codigo + ' - ' + (element as ProductosDetalleI).producto)
            });
            this.filteredoptions = this.myControl.valueChanges.pipe(
                startWith(''),
                map(value => this._filter(value || '')),
            );
        })

        console.table(this.cartItems)
    }

    private _filter(value: string): string[] {
        if (value.length > 1) {
            const filterValue = value.toLowerCase();
            return this.listadoProductos.filter(option => option.toLowerCase().includes(filterValue));
        } else {
            return []
        }
    }

    onEnter(evt: any) {

        if (evt.source.selected) {
            const valor = evt.source.value
            const filterValue = valor.toLowerCase();
            this.listadoMostrar = this.listadoProductosTodos.filter(option => (option.codigo + ' - ' + option.producto).toLowerCase().includes(filterValue));
            return true
        }
        else {
            this.listadoMostrar = []
            return false
        }
    }

    cargar(producto: any) {
        console.table(producto)
        this.idProductoModal = producto.idproducto
        this.productoModal = producto.producto
        this.precioModal = producto.precio
        this.precio = Math.round(producto.precio)
        this.cantidad = 1

    }

    precioCambio() {
        this.precioModal = Math.round((this.precio * this.cantidad) * 100) / 100
    }

    cargaProducto() {
        console.clear()
        // console.log({ 'id': this.idProductoModal, 'descripcion': this.productoModal, 'precio': parseFloat(this.precioModal.toString()).toFixed(2), 'precioIndividual': this.precio, 'caintidad': this.cantidad })
        // console.log([{ id: this.idProductoModal, descripcion: this.productoModal, precio: parseFloat(this.precioModal.toString()).toFixed(2), precioIndividual: this.precio, caintidad: this.cantidad }])
        // this.cartItems.push([{ 'id': this.idProductoModal, 'descripcion': this.productoModal, 'precio': parseFloat(this.precioModal.toString()).toFixed(2), 'precioIndividual': this.precio, 'caintidad': this.cantidad }])

        this.products.push({ id: this.idProductoModal, descripcion: this.productoModal, precio: parseFloat(this.precioModal.toString()).toFixed(2), precioIndividual: this.precio, caintidad: this.cantidad })

        console.log(this.products)
        // this.addToCart({ id: this.idProductoModal, descripcion: this.productoModal, precio: parseFloat(this.precioModal.toString()).toFixed(2), precioIndividual: this.precio, caintidad: this.cantidad })
        this.addToCart({ 'id': this.idProductoModal, 'descripcion': this.productoModal, 'precio': parseFloat(this.precioModal.toString()).toFixed(2), 'precioIndividual': this.precio, 'caintidad': this.cantidad })
        localStorage.setItem('carrito', JSON.stringify(this.cartItems))

        console.log()
    }
}

