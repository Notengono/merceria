import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Categoria } from 'src/app/model/categoria';
import { SubCategoriaI } from 'src/app/model/sub-categoria-i';
import { CategoriasService } from 'src/app/services/categorias.service';
import { ProductosService } from 'src/app/services/productos.service';

@Component({
  selector: 'app-nuevo-producto',
  templateUrl: './nuevo-producto.component.html',
  styleUrls: ['./nuevo-producto.component.css']
})
export class NuevoProductoComponent implements OnInit {

  busquedaForm = this.fb.group({
    inputGroupCategoria: 0,
    inputGroupSubCategoria: 0
  })

  constructor(
    private _categorias: CategoriasService,
    private _productos: ProductosService,
    private fb: FormBuilder
  ) { }

  filtro: string = ""
  listadoCategoria: Categoria[] = []
  listadoSubCategoria: SubCategoriaI[] = []
  listadoProductos: any[] = []

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
    this._productos.postProductos(this.busquedaForm.value).subscribe(respuesta => {
      this.listadoProductos = Object.values(respuesta['resultado'])
    })
  }
}
