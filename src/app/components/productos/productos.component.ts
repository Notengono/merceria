import { Component, OnInit } from '@angular/core';
import { Categoria } from 'src/app/interfaces/categoria';
import { CategoriasService } from 'src/app/services/categorias.service';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit {
  listadoCategoria: Categoria[] = [];

  constructor(private _categorias: CategoriasService) { }

  ngOnInit(): void {
    // this._categorias.getCategorias().subscribe((respuesta: Categoria) => {
    //   console.table(respuesta)
    //   this.listadoCategoria.push({
    //     id: respuesta.idgrupo
    //   });
    // });
  }

}
