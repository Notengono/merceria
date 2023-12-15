import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Categoria } from 'src/app/model/categoria';
import { CategoriasService } from 'src/app/services/categorias.service';

@Component({
  selector: 'app-sub-grupos',
  templateUrl: './sub-grupos.component.html',
  styleUrls: ['./sub-grupos.component.css']
})
export class SubGruposComponent implements OnInit {

  altaForm = this.fb.group({
    inputGroupCategoria: 0,
    inputGroupSubCategoria: '',
    descripcionSubCategoria: ''
  })

  listadoCategoria: Categoria[] = [];
  constructor(private fb: FormBuilder,
    private _categoria: CategoriasService) { }

  ngOnInit(): void {
    this._categoria.getCategorias().subscribe(respuesta => { this.listadoCategoria = Object.values(respuesta) })
  }


  limpiarSubCategoria() {
    this.altaForm.reset();
    this.altaForm.patchValue({ inputGroupCategoria: 0 })
  }

  async almacenarSubCategoria() {
    this._categoria.postSubCategoria(this.altaForm.value).subscribe(resultado => {
      this.ngOnInit();
      this.altaForm.reset();

      this.appendAlert(resultado.error, (resultado.estado == 200 ? 'success' : 'danger'))
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

  // filtro: string = ""
  // listadoCategoria: Categoria[] = []
  // listadoSubCategoria: SubCategoriaI[] = []
  // listadoProductos: any[] = []
  
  /**
   * 
   * Buscar las sub categorias de la principal categoria
   * 
   */

  onClikCategoria(event: any) {
    // this.listadoSubCategoria = []
    // this.busquedaForm.patchValue({ inputGroupSubCategoria: 0 });

    // this._categorias.getSubCategorias(event.value).subscribe(respuesta => {
    //   this.listadoSubCategoria = Object.values(respuesta['resultado'])
    // });
  }
}
