import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Categoria } from "../model/categoria";

const apiURL = environment.apiURL;

@Injectable({
  providedIn: 'root'
})

export class CategoriasService {

  constructor(private _http: HttpClient) { }

  getCategorias() {
    const header = new HttpHeaders();
    header.append("Content-Type", "applications/json");
    return this._http.get<Categoria>(
      `${apiURL}categorias`, { headers: header });
  }
  
  getSubCategorias(valor: number) {
    const header = new HttpHeaders();
    header.append("Content-Type", "applications/json");
    return this._http.get<any>(
      `${apiURL}subcategorias/${valor}`, { headers: header });
  }
}
