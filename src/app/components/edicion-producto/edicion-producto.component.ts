import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Categoria } from 'src/app/model/categoria';
import { ProductoDetalleI } from 'src/app/model/producto-detalle';
import { SubCategoriaI } from 'src/app/model/sub-categoria-i';
import { CategoriasService } from 'src/app/services/categorias.service';
import { ProductosService } from 'src/app/services/productos.service';

@Component({
  selector: 'app-edicion-producto',
  templateUrl: './edicion-producto.component.html',
  styleUrls: ['./edicion-producto.component.css']
})
export class EdicionProductoComponent implements OnInit {

  altaForm = this.fb.group({
    idproducto: 0,
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
    private activatedRoute: ActivatedRoute
  ) { }

  filtro: string = ""
  listadoCategoria: Categoria[] = []
  listadoSubCategoria: SubCategoriaI[] = []
  listadoProductos: any[] = []
  productoEdicion: ProductoDetalleI = {
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



    this.activatedRoute.paramMap.subscribe(params => {
      if (params.get('id')) {

        this.altaForm.patchValue({
          idproducto: Number(params.get('id'))
        })


        this.productoEdicion = {
          idproducto: Number(params.get('id')),
          categoria: '',
          subcategoria: '',
          idproductometa: 0,
          precio: '',
          descripcion: ''
        }

        this._productos.getProduto(this.productoEdicion.idproducto.valueOf())
          .subscribe(respuesta => {
            const datos = respuesta.datos
            this.altaForm.patchValue({
              idproducto: datos.idproducto,
              inputGroupCategoria: datos.idgrupo,
              inputGroupSubCategoria: datos.idsubgrupo,
              codigo: datos.codigo,
              descripcion: datos.idproductometa,
              precio: datos.idprecio
            })

            const valor = <number>this.altaForm.get('inputGroupCategoria')?.value

            this._categorias.getSubCategorias(valor).subscribe(respuesta => {
              this.listadoSubCategoria = Object.values(respuesta['resultado'])
            });

            const descripcion = this.altaForm.get('descripcion')?.value
            this._productos.getProdutoMeta(descripcion).subscribe(respuesta => {
              this.altaForm.patchValue({
                descripcion: respuesta.datos.descripcion,
              })
            }
            )
            
            const precio = this.altaForm.get('precio')?.value
            this._productos.getPrecios(descripcion).subscribe(respuesta => {
              this.altaForm.patchValue({
                precio: respuesta.datos.precio,
              })
            }
            )

          }
          )
      }
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

    console.table(this.altaForm.value)

    this._productos.postProducto(this.altaForm.value).subscribe(resultado => console.log(resultado))
  }
  limpiarProducto() {
    this.altaForm.reset()
  }

}
