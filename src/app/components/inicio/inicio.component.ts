import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  nombre: string = ''
  constructor(private _auth: AuthService) { }

  ngOnInit(): void {
    const usuario: any = this._auth.getUser()
    this.nombre = JSON.parse(usuario).nombre
  }

}
