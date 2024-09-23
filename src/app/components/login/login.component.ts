import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuariosService } from 'src/app/services/usuarios.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private _usuariosService: UsuariosService) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {

      console.log(this.loginForm.value);

      this._usuariosService.postLogin(this.loginForm.value).subscribe(respuesta => console.log(respuesta))


      // Aquí puedes añadir la lógica para autenticar al usuario
    }
  }

  ngOnInit(): void {
  }

}
