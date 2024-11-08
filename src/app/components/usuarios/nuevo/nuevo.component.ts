import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
  selector: 'app-nuevo',
  templateUrl: './nuevo.component.html',
  styleUrls: ['./nuevo.component.css']
})
export class NuevoComponent implements OnInit {

  usuarioForm = this.fb.group({
    nombre: '',
    userName: '',
    userPass: '',
    user_baja: 0,
    intentos: 0
  })

  constructor(private fb: FormBuilder,
    private router: Router,
    private _usuarioService: UsuariosService
  ) { }

  ngOnInit(): void {
  }
  cancelar() {
    this.router.navigate(['/listadoUsuarios']);
  }
  aceptar() {
    this._usuarioService.postUsuario(this.usuarioForm.value).subscribe(resultado => console.log(resultado))
  }
}
