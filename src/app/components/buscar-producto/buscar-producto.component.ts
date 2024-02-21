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


    constructor(private _productos: ProductosService, private fb: FormBuilder) { }

    ngOnInit() {
        this.listadoProductos = []
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
}
