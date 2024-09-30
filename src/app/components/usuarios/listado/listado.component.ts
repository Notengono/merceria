import { Component, OnInit } from '@angular/core';
import { UsuariosService } from 'src/app/services/usuarios.service';

@Component({
    selector: 'app-listado',
    templateUrl: './listado.component.html',
    styleUrls: ['./listado.component.css']
})
export class ListadoComponent implements OnInit {
    // ALTER TABLE `merceria`.`presupuesto` ADD COLUMN `usuario` INTEGER UNSIGNED AFTER `creado`;

    listadoMostrar: any = [];
    buscando: boolean = false

    constructor(private _usuarioService: UsuariosService) { }

    ngOnInit(): void {
        this.buscarListado()
    }

    habilita(id: number) {
        console.log(id)
        this._usuarioService.postHabilita(id).subscribe(resultado => {
            resultado ? this.buscarListado() : ''
        })
    }

    buscarListado() {
        this.buscando = true
        this._usuarioService.getUsuarios().subscribe(respuesta => {
            console.table(respuesta)
            this.listadoMostrar = respuesta
        })
    }
}
