import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Categoria } from 'src/app/models/categoria';
import { CategoriasService } from 'src/app/services/categorias.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {

  busquedaForm = this.fb.group({
    inputGroupCategoria: '',
    inputGroupSubCategoria: ''
  })

  constructor(
    private _categorias: CategoriasService,
    private fb: FormBuilder
  ) { }

  listadoCategoria: Categoria[] = []
  listadoSubCategoria: Categoria[] = []

  ngOnInit(): void {
    this._categorias.getCategorias().subscribe(respuesta => {
      this.listadoCategoria = Object.values(respuesta)
      console.log(this.listadoCategoria)
    });
  }

  onClikCategoria(event: any) {
    this._categorias.getSubCategorias(event.value).subscribe(respuesta => {
      this.listadoSubCategoria = Object.values(respuesta)
      console.log(this.listadoCategoria)
    });
  }

}
