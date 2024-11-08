import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-cambio-clave',
  templateUrl: './cambio-clave.component.html',
  styleUrls: ['./cambio-clave.component.css']
})
export class CambioClaveComponent implements OnInit {

  usuarioForm = this.fb.group({
    id: '',
    nombre: '',
    userName: '',
    userPass: '',
    user_baja: 0,
    intentos: 0
  })

  constructor(private fb: FormBuilder,
    private _usuarioService: UsuariosService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this._usuarioService.getUsuario(params['id']).subscribe(resultado => {
        this.usuarioForm.patchValue({
          id: resultado.id,
          nombre: resultado.nombre,
          userName: resultado.user_name
        })
      })
    });
  }

  aceptar() {
    this._usuarioService.putUsuario(this.usuarioForm.value).subscribe(resultado => console.log(resultado))
  }
  cancelar() {
    this.router.navigate(['/listadoUsuarios']);
  }

}
