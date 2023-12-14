import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { tap } from "rxjs";
import { environment } from 'src/environments/environment';
import { Categoria } from "../models/categoria";

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
    return this._http.get<Categoria>(
      `${apiURL}subcategorias/${valor}`, { headers: header });
  }
}
