import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Categoria } from 'src/app/model/categoria';
import { SubCategoriaI } from 'src/app/model/sub-categoria-i';
import { CategoriasService } from 'src/app/services/categorias.service';
import { ProductosService } from 'src/app/services/productos.service';
import { ProductoDetalleI } from 'src/app/model/producto-detalle';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-nuevo-producto',
  templateUrl: './nuevo-producto.component.html',
  styleUrls: ['./nuevo-producto.component.css']
})
export class NuevoProductoComponent implements OnInit {

  altaForm = this.fb.group({
    inputGroupCategoria: 0,
    inputGroupSubCategoria: 0,
    codigo: '',
    descripcion: '',
    precio: 0
  })

  constructor(
    private _categorias: CategoriasService,
    private _productos: ProductosService,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar
  ) { }

  filtro: string = ""
  listadoCategoria: Categoria[] = []
  listadoSubCategoria: SubCategoriaI[] = []
  listadoProductos: any[] = []
  productoNuevo: ProductoDetalleI = {
    idproducto: 0,
    categoria: '',
    subcategoria: '',
    idproductometa: 0,
    precio: '',
    descripcion: ''
  }

  ngOnInit(): void {
    this._categorias.getCategorias().subscribe(respuesta => {
      this.listadoCategoria = Object.values(respuesta)
    });
  }

  onClikCategoria(event: any) {
    this.listadoSubCategoria = []
    this.altaForm.patchValue({ inputGroupSubCategoria: 0 });

    this._categorias.getSubCategorias(event.value).subscribe(respuesta => {
      this.listadoSubCategoria = Object.values(respuesta['resultado'])
    });
  }

  onClikBuscarProductos() {
    this.listadoProductos = []
    this._productos.postProductos(this.altaForm.value).subscribe(respuesta => {
      console.log(respuesta)
      this.listadoProductos = Object.values(respuesta['resultado'])
    })
  }

  almacenarProducto() {
    this._productos.postProducto(this.altaForm.value).subscribe(resultado => {
      if ((resultado as any).estado == 402) {
        this._snackBar.open((resultado as any).error, '',
          { duration: 3000, horizontalPosition: 'center', panelClass: ['mat-toolbar', 'mat-warn'] }
        );
      } else {
        this._snackBar.open((resultado as any).error, '',
          { duration: 3000, horizontalPosition: 'center', panelClass: ['mat-toolbar', 'mat-primary'] }
        );
        this.onClikBuscarProductos()
        this.limpiarCarga()
      }
    })
  }

  limpiarCarga() {
    this.altaForm.patchValue({
      codigo: '',
      descripcion: '',
      precio: 0
    })
  }

  limpiarProducto() {
    this.altaForm.reset()
  }
}
