import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const apiURL = environment.apiURL;
@Injectable({
    providedIn: 'root'
})

export class UsuariosService {

    constructor(private _http: HttpClient) { }

    postLogin(valor: any) {
        const header = new HttpHeaders();
        header.append("Content-Type", "applications/json");
        return this._http.post<any>(
            `${apiURL}login`, valor, { headers: header });
    }

    postHabilita(valor: any) {
        const header = new HttpHeaders();
        header.append("Content-Type", "applications/json");
        return this._http.post<any>(
            `${apiURL}postHabilita`, { id: valor }, { headers: header });
    }

    getUsuarios() {
        const header = new HttpHeaders();
        header.append("Content-Type", "applications/json");
        return this._http.get<any>(
            `${apiURL}getUsuarios`, { headers: header });
    }

    getUsuario(dato: any) {
        const header = new HttpHeaders();
        header.append("Content-Type", "applications/json");
        return this._http.get<any>(
            `${apiURL}getUsuario/${dato}`, { headers: header });
    }
    postUsuario(datos: any) {
        const header = new HttpHeaders();
        header.append("Content-Type", "applications/json");
        return this._http.post<any>(
            `${apiURL}postUsuario`, datos, { headers: header });
    }

    putUsuario(datos: any) {
        const header = new HttpHeaders();
        header.append("Content-Type", "applications/json");
        return this._http.put<any>(
            `${apiURL}putUsuario`, datos, { headers: header });
    }
}
