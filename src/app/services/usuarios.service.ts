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
}
