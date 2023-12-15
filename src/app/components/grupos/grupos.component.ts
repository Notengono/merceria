import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Categoria } from 'src/app/model/categoria';
import { CategoriasService } from 'src/app/services/categorias.service';

@Component({
  selector: 'app-grupos',
  templateUrl: './grupos.component.html',
  styleUrls: ['./grupos.component.css']
})
export class GruposComponent implements OnInit {

  altaForm = this.fb.group({
    inputGroupCategoria: '',
    descripcionCategoria: ''
  })

  listadoCategoria: Categoria[] = [];
  constructor(private fb: FormBuilder,
    private _categoria: CategoriasService) { }

  ngOnInit(): void {
    this._categoria.getCategorias().subscribe(respuesta => { this.listadoCategoria = Object.values(respuesta) })
  }

  limpiarCategoria() {
    this.altaForm.reset();
  }
  async almacenarCategoria() {
    this._categoria.postCategoria(this.altaForm.value).subscribe(resultado => {
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
}
