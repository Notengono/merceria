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
  option: string[] = ['One', 'Two', 'Three'];
  filteredoptions: Observable<string[]> | undefined;

  filtro: string = "";
  listadoProductos: string[] = []
  listadoProductosTodos: any[] = []
  busquedaForm = this.fb.group({
    inputGroupCategoria: 0,
    inputGroupSubCategoria: 0
  })


  constructor(private _productos: ProductosService, private fb: FormBuilder) { }

  ngOnInit() {
    this.listadoProductos = []
    this._productos.postProductos(this.busquedaForm.value).subscribe(respuesta => {
      this.listadoProductosTodos = (respuesta['resultado'])
      console.log(this.listadoProductosTodos)
      Object.values(respuesta['resultado']).forEach(element => {
        this.listadoProductos.push((element as ProductosDetalleI).producto)
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
      console.log(evt.source.value);
      this.filtro = evt.source.value;
    }
  }
}
