import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { UsuariosService } from 'src/app/services/usuarios.service';


@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    loginForm: FormGroup
    isError: boolean = false
    mensajeError: string = ''

    constructor(private fb: FormBuilder,
        private _usuariosService: UsuariosService,
        private _authService: AuthService,
        private router: Router) {
        this.loginForm = this.fb.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    ngOnInit(): void {
        if (this._authService.loggedIn()) {
            this.router.navigate(['/inicio']);
        }
    }
    onSubmit() {
        if (this.loginForm.valid) {

            // console.log(this.loginForm.value);
            this._usuariosService.postLogin(this.loginForm.value).subscribe({
                next: (respuesta) => {
                    this._authService.setUser(respuesta.user);
                    this._authService.setToken(respuesta.token);
                    this.isError = false;
                },
                error: (err) => {
                    this.isError = true
                    this.isError = err.error.error
                    this.mensajeError = err.error.message
                },
                complete: () => { this.router.navigate(['/inicio']); }
            })

        }
    }
}
