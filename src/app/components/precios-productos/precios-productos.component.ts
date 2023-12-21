import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Categoria } from 'src/app/model/categoria';
import { SubCategoriaI } from 'src/app/model/sub-categoria-i';
import { CategoriasService } from 'src/app/services/categorias.service';
import { ProductosService } from 'src/app/services/productos.service';

@Component({
    selector: 'app-precios-productos',
    templateUrl: './precios-productos.component.html',
    styleUrls: ['./precios-productos.component.css']
})
export class PreciosProductosComponent implements OnInit {

    busquedaForm = this.fb.group({
        inputGroupCategoria: 0,
        inputGroupSubCategoria: 0
    })

    constructor(
        private _categorias: CategoriasService,
        private _productos: ProductosService,
        private fb: FormBuilder
    ) { }

    porcentajeNuevo: number = 0
    filtro: string = ""
    listadoCategoria: Categoria[] = []
    listadoSubCategoria: SubCategoriaI[] = []
    listadoProductos: any[] = []

    listadoIdPrecio: any[] = []

    ngOnInit(): void {
        this._categorias.getCategorias().subscribe(respuesta => {
            this.listadoCategoria = Object.values(respuesta)
        });
    }

    onClikCategoria(event: any) {
        this.listadoSubCategoria = []
        this.busquedaForm.patchValue({ inputGroupSubCategoria: 0 });

        this._categorias.getSubCategorias(event.value).subscribe(respuesta => {
            this.listadoSubCategoria = Object.values(respuesta['resultado'])
        });
    }

    onClikBuscarProductos() {
        this.listadoProductos = []
        this.listadoIdPrecio = []
        this._productos.postProductos(this.busquedaForm.value).subscribe(respuesta => {
            this.listadoProductos = Object.values(respuesta['resultado'])
            this.listadoProductos.forEach((element) => this.listadoIdPrecio.push(element.idprecio));
        })

    }

    onClikAjustarPrecios() {
        this._productos.postNuevoPrecio(((this.porcentajeNuevo / 100) + 1), this.listadoIdPrecio).subscribe(resultado => {
            this.appendAlert(resultado.error, (resultado.estado == 200 ? 'success' : 'danger'))
            resultado.estado == 200 ? this.onClikBuscarProductos() : ''
        })
    }

    appendAlert(mensaje: string, estado: any) {
        const wrapper = document.createElement('div')
        wrapper.innerHTML = [
            `<div class="alert alert-${estado} alert-dismissible" role="alert">`,
            `   <div>${mensaje}</div>`,
            '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
            '</div>'
        ].join('')

        document.getElementById('liveAlertPlaceholder')?.append(wrapper)
    }

}
