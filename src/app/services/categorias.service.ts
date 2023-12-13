import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const apiURL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})

export class CategoriasService {

  constructor(private _http: HttpClient) { }

  getCategorias() {
    const header = new HttpHeaders();
    header.append("Content-Type", "applications/json");
    return this._http.get(
      `${apiURL}categorias`, { headers: header });
  }
}
