import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, map, startWith } from 'rxjs';
import { ProductosDetalleI } from 'src/app/model/productos-detalle';
import { ProductosService } from 'src/app/services/productos.service';

@Component({
  selector: 'app-precio-por-producto',
  templateUrl: './precio-por-producto.component.html',
  styleUrls: ['./precio-por-producto.component.css']
})
export class PrecioPorProductoComponent implements OnInit {

  myControl = new FormControl('');
  option: string[] = ['One', 'Two', 'Three'];
  filteredoptions: Observable<string[]> | undefined;

  filtro: string = "";
  listadoProductos: string[] = []
  listadoProductosTodos: any[] = []
  busquedaForm = this.fb.group({
    buscar: ''
  })

  precioForm = this.fb.group({
    codigo: '',
    grupo: '',
    subgrupo: '',
    producto: '',
    idproducto: '',
    precio: '',
  })


  constructor(private _productos: ProductosService, private fb: FormBuilder, private _snackBar: MatSnackBar) { }

  ngOnInit() { }

  buscarProducto() {
    this.listadoProductos = []

    this._productos.getProdutos(this.busquedaForm.getRawValue().buscar).subscribe(respuesta => {
      this.listadoProductosTodos = (respuesta['datos'])
      console.log(this.listadoProductosTodos)
      Object.values(respuesta['datos']).forEach(element => {
        this.listadoProductos.push((element as ProductosDetalleI).producto)
      });

      // this.filteredoptions = this.myControl.valueChanges.pipe(
      //   startWith(''),
      //   map(value => this._filter(value || '')),
      // );
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

  cambio(producto: any) {
    this.precioForm.patchValue({
      codigo: producto.codigo,
      grupo: producto.grupo,
      subgrupo: producto.subgrupo,
      idproducto: producto.idproducto,
      producto: producto.producto,
      precio: producto.precio
    })
  }

  actualizarPrecio() {
    this._productos.postNuevoPrecioIndividual(this.precioForm.value).subscribe(respuesta => {
      if ((respuesta as any).estado == 402) {
        this._snackBar.open((respuesta as any).error, '',
          { duration: 3000, horizontalPosition: 'center', panelClass: ['mat-toolbar', 'mat-warn'] }
        );
      } else {
        this._snackBar.open((respuesta as any).error, '',
          { duration: 3000, horizontalPosition: 'center', panelClass: ['mat-toolbar', 'mat-primary'] }
        );
      }
    }
    )
  }

}
